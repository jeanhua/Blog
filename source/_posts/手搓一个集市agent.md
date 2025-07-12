---
title: 手搓一个集市agent
date: 2025-07-12 12:48:50
tags:
- agent
- AI
- 校园集市
categories:
- 随笔
typora-root-url: ./..
---

## 手搓一个赞哦校园集市agent

最近看着大一小登军训，在集市上各种吐槽，各种对战，本着凑热闹的想法，打算做一个ai来逛集市，顺便学习一下agent

完整代码：https://github.com/jeanhua/zanaoAgentTest

### 一、编写接口访问集市

ai肯定不能像人一样点进去软件里面去翻帖子，所以需要编写一个接口来执行这些操作，本质上就是爬虫。对于赞哦校园集市，既有软件又有小程序，那么小程序就是最好的突破口，通过解包小程序，逆向加密算法，来获取鉴权的请求头，从而来模拟正常的请求来获取帖子

这是逆向的相关代码

![1](/image/手搓agent/1.png)

转成go之后就是这样

```go
func getM(length int) string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	result := make([]byte, length)
	for i := range result {
		result[i] = byte(r.Intn(10)) + '0'
	}
	return string(result)
}

func md5Hash(input string) string {
	hasher := md5.New()
	hasher.Write([]byte(input))
	return hex.EncodeToString(hasher.Sum(nil))
}

func getHeaders(userToken, schoolalias string) map[string]string {
	m := getM(20)
	td := time.Now().Unix()
	signString := fmt.Sprintf("%s_%s_%d_1b6d2514354bc407afdd935f45521a8c", schoolalias, m, td)
	return map[string]string{
		"X-Sc-Version":  "3.4.4",
		"X-Sc-Nwt":      "wifi",
		"X-Sc-Wf":       "",
		"X-Sc-Nd":       m,
		"X-Sc-Cloud":    "0",
		"X-Sc-Platform": "windows",
		"X-Sc-Appid":    "wx3921ddb0258ff14f",
		"X-Sc-Alias":    schoolalias,
		"X-Sc-Od":       userToken,
		"Content-Type":  "application/x-www-form-urlencoded",
		"X-Sc-Ah":       md5Hash(signString),
		"xweb_xhr":      "1",
		"User-Agent":    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090c33)XWEB/14185",
		"X-Sc-Td":       strconv.FormatInt(td, 10),
		"Accept":        "*/*",
	}
}
```

其中`"X-Sc-Od":userToken`这里需要抓包获取token，这里可以使用 Fiddler 来抓包

然后继续抓包获取主页，帖子详情，评论区，热帖，搜索等的url，然后封装成一个类给我们的ai来调用

**比如获取最新的帖子**

```go
func (z *Zanao) GetNewest() string {
	request, err := http.NewRequest(http.MethodPost, "https://api.x.zanao.com/thread/v2/list", nil)
	if err != nil {
		log.Println(err)
		return ""
	}
	headers := getHeaders(zaToken, "scu")
	for k, v := range headers {
		request.Header.Set(k, v)
	}
	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return ""
	}
	defer resp.Body.Close()
	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return ""
	}
	var posts PostsList
	err = json.Unmarshal(respBytes, &posts)
	if err != nil {
		log.Println(err)
		return ""
	}
	var back strings.Builder
	back.WriteString(contentHeader)
	for _, post := range posts.Data.List {
		back.WriteString("帖子ID：" + post.ID + "\n")
		back.WriteString("昵称: " + TrimSpaceAndBreakLine(post.Nickname) + "\n")
		back.WriteString("标题: " + TrimSpaceAndBreakLine(post.Title) + "\n")
		back.WriteString("内容: " + TrimSpaceAndBreakLine(post.Content) + "\n")
		back.WriteString("浏览量: " + strconv.Itoa(post.ViewCount) + "\n")
		back.WriteString("点赞数: " + post.LikeCount + "\n\n")
	}
	return back.String()
}
```

### 二、编写接口进行AI交换

我们自然是不在本地跑AI模型的，所以需要调用AI厂商的api服务，因为智谱AI还可以，刚好有免费的思考模型，故我针对这个api封装了一个ai交互类

**首先写一个接口，便于不同的AI进行拓展**

```go
type AiModel interface {
	Ask(question string) *AiAnswer
}

type AiAnswer struct {
	Response       string                      `json:"response"`
	IsFunctionCall bool                        `json:"isFunction_call"`
	FunctionCall   []functioncall.FunctionCall `json:"function_call"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}
```

**然后是智谱AI**

```go
type ZhipuAIBot struct {
	token        string
	SystemPrompt string
	messageChain []*Message
}

const toolPrompt = `当你想要使用工具时，输出一个 #Call + 工具，没事就不用管
你有以下可用工具：
### 校园集市论坛相关：
- 'browse_homepage()'：访问主页，获取最新的帖子列表。
- 'browse_hot()'：访问24小时内热度最高的帖子列表。
- 'search(keyword:string)'：使用关键词搜索相关帖子。
- 'view_post(post_id:string)'：查看某篇帖子的详细内容。
- 'view_comments(post_id:string)'：查看某篇帖子的评论区内容。

当你要执行某个操作时，请以'#Call' + 严格的 JSON 格式输出你的动作和参数，例如：

#Call
{
  "action": "search",
  "parameters": {
    "keyword": "图书馆"
  }
}

注意事项：
1.请确保每次响应只包含一个动作，并且不要添加任何额外解释。我会根据你的指令执行操作并将结果反馈给你。
2.不要连续多次调用#Call，调用几次后就回答问题
3.有些#Call调用在短时间内是不变的，比如热帖，评论，帖子详情，请求过了就不要重复请求了
`

func NewZhipu(token string, prompt string) *ZhipuAIBot {
	zp := &ZhipuAIBot{
		token:        token,
		SystemPrompt: prompt + "\n" + toolPrompt,
	}
	zp.messageChain = []*Message{
		{
			Role:    "system",
			Content: zp.SystemPrompt,
		},
	}
	return zp
}

const requestUrl string = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

type RequestBody struct {
	Model    string     `json:"model"`
	Messages []*Message `json:"messages"`
	Stream   bool       `json:"stream"`
}

type ResponseBody struct {
	Choices []struct {
		Index   int `json:"index"`
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

type thinkingResponse struct {
	thinking string
	text     string
}

func request(msg []*Message, token string) *thinkingResponse {
	client := &http.Client{}
	body := &RequestBody{
		Model:    "glm-z1-flash",
		Messages: msg,
		Stream:   false,
	}
	postBytes, err := json.Marshal(body)
	if err != nil {
		log.Println(err)
	}
	request, err := http.NewRequest(http.MethodPost, requestUrl, bytes.NewReader(postBytes))
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "Bearer "+token)
	if err != nil {
		log.Println(err)
		return nil
	}
	resp, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return nil
	}
	defer resp.Body.Close()
	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return nil
	}
	var response ResponseBody
	json.Unmarshal(respBytes, &response)
	sort.Slice(response.Choices, func(i, j int) bool {
		return response.Choices[i].Index < response.Choices[j].Index
	})
	var respText string
	for _, v := range response.Choices {
		respText += v.Message.Content
	}
	splitText := strings.Split(respText, "</think>")
	if len(splitText) == 2 {
		return &thinkingResponse{
			thinking: strings.TrimSpace(splitText[0]),
			text:     strings.TrimSpace(splitText[1]),
		}
	} else {
		return nil
	}
}

func (zp *ZhipuAIBot) Ask(question string) *AiAnswer {
	if strings.HasPrefix(question, "#新对话") {
		zp.messageChain = []*Message{
			{
				Role:    "system",
				Content: zp.SystemPrompt,
			},
		}
	}
	zp.messageChain = append(zp.messageChain, &Message{
		Role:    "user",
		Content: question,
	})
	isFunccall := false
	funcCallNums := 0
	funcs := []functioncall.FunctionCall{}
    resp := request(zp.messageChain, zp.token)
		if resp == nil {
			return nil
		}
		//log.Println(resp.text)
		zp.messageChain = append(zp.messageChain, &Message{
			Role:    "assistant",
			Content: resp.text,
		})
    return &AiAnswer{
				Response:       resp.text,
				IsFunctionCall: isFunccall,
				FunctionCall:   funcs,
			}
}

```

### 三、编写function call接口

集市工具有了，AI交互有了，那怎么让AI调用这个接口呢？

就是在system prompt 告诉 ai ,如果想要调用某个工具，需要输出指定格式的内容，我们识别出现这些内容时就去调用相关函数

```go
type FunctionCall struct {
	Action string         `json:"action"`
	Param  map[string]any `json:"parameters"`
}

func CallFunction(functionCall *FunctionCall) string {
	switch functionCall.Action {
	case "browse_homepage":
		{
			return browseHomepage()
		}
	case "browse_hot":
		{
			return browseHot()
		}
	case "search":
		{
			return search(functionCall.Param["keyword"].(string))
		}
	case "view_post":
		{
			return viewPost(functionCall.Param["post_id"].(string))
		}
	case "view_comments":
		{
			return viewComments(functionCall.Param["post_id"].(string))
		}
	}
	return ""
}
```

**然后修改一下ai接口，让ai能调用**

```go
for {
		resp := request(zp.messageChain, zp.token)
		if resp == nil {
			return nil
		}
		//log.Println(resp.text)
		zp.messageChain = append(zp.messageChain, &Message{
			Role:    "assistant",
			Content: resp.text,
		})
		if strings.HasPrefix(resp.text, "#Call") {
			if funcCallNums >= 3 {
				zp.messageChain = append(zp.messageChain, &Message{
					Role:    "user",
					Content: "你的调用次数已达限制，请先回答用户问题",
				})
				continue
			}
			funcCallNums += 1
			funccallText := strings.TrimPrefix(resp.text, "#Call")
			var funccall functioncall.FunctionCall
			err := json.Unmarshal([]byte(funccallText), &funccall)
			if err != nil {
				zp.messageChain = append(zp.messageChain, &Message{
					Role:    "user",
					Content: "FunctionCall格式错误，请重新输出",
				})
				continue
			}
			funcs = append(funcs, funccall)
			log.Println("正在调用" + funccall.Action)
			callResult := functioncall.CallFunction(&funccall)
			if callResult == "" {
				callResult = "调用" + funccall.Action + "失败"
			}
			zp.messageChain = append(zp.messageChain, &Message{
				Role:    "user",
				Content: callResult,
			})
			continue
		} else {
			return &AiAnswer{
				Response:       resp.text,
				IsFunctionCall: isFunccall,
				FunctionCall:   funcs,
			}
		}
	}
```

### 四、结果展示

**查看热帖**

![browsehot](/image/手搓agent/browsehot.png)

**查看帖子详情**

![continue](/image/手搓agent/continue.png)

**搜索相关帖子**

![search](/image/手搓agent/search.png)

**大功告成**
