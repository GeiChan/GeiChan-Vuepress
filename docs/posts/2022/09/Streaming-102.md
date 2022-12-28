---
layout: Post  # 必须
title: Streaming 102 - The world beyond batch  # 博客标题（必须）
subtitle: 无界数据处理的 What, Where, When, How（方便回顾，自己做了个翻译）  # 博客副标题（可选）
date: 2022-09-01  # 博客日期，会显示在文章头部（可选）
useHeaderImage: true  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
headerImage: /img/blog_cover/2022/09/streaming-102-cover.png   # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
headerMask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
permalinkPattern: /post/:year/:month/:slug/
tags:  # 博客标签
- 大数据
- streaming
---

> Author: Tyler Akidau
>
> 原文连接: https://www.oreilly.com/radar/the-world-beyond-batch-streaming-102/
>
> Editor's Note: 这是关于数据处理演变两个系列中的第二部分，着重关注流式系统、无界数据集、以及大数据的未来

## 1. 介绍

欢迎回来，如果你错过了我之前的帖子 —— [The World beyond batch: Streaming 101]()，我强烈建议您花时间先阅读该内容。它为我将在这篇文章中介绍的主题奠定了必要的基础，并且我假设您已经熟悉那里介绍的术语和概念。~~Caveat lector and all that.~~

另外，需要注意的是，这篇文章包含许多动画，所以那些试图打印它的人会错过一些最好的部分。~~Caveat printor and all that.~~

简单回顾一下，上次我着重于三个主要领域：==术语(terminology)==，当我使用类似"streaming"等重载术语时，精确定义我(想表达)的意思；==批与流的比较(batch versus streaming)==，比较这两种系统的理论能力，并提出只有完成两件事才能使流式系统超越批处理系统：正确性和时间推理工具；==数据处理模式==，研究批处理系统和流式系统在处理有界和无界数据时采用的基本方法。

在这篇文章中，我想进一步关注上次的数据处理模式，但更详细，并且在具体示例的背景下。这篇文章的范围将包含两个部分：

- Streaming 101 回顾：简单回顾一下 Streaming 中介绍的概念，并添加了一个运行示例来突出重点
- Streaming 102：Streaming 101 的配套文章，详细介绍了在处理无界数据时很重要的其他概念，并继续使用具体示例作为解释它们的工具

当我们完成时，我们将涵盖我认为是稳健的==无序数据处理所需的核心原则和概念集==。这些时间推理的工具，将真正的让您超越经典的批处理。

为了让您了解他们在行动中的样子，我将使用 [Dataflow SDK](https://github.com/GoogleCloudPlatform/DataflowJavaSDK) 的代码片段(i.e., 用于 [Google Cloud Dataflow](https://cloud.google.com/dataflow/) 的 API)，加上动画以提供概念的视觉表现。我使用 Dataflow SDK 而不是人们可能更熟悉的东西(比如，Spark Streaming 或者 Storm)的原因是实际上没有其他系统可以为我想要涵盖的所有示例提供所需的表现力。好消息是，其他系统也开始朝这个方向发展。更好的消息是，我们(Google)今天向 Apache 软件基金会提交了一份提案，以创建一个 Apache Dataflow 孵化器项目(与 data Artisans、Cloudera、Talend 以及其他一些公司合作)，希望围绕 [Dataflow Model](http://www.vldb.org/pvldb/vol8/p1792-Akidau.pdf) 提供的强大的乱序处理语义建立一个开放的社区和生态系统。这应该是一个非常有趣的 2016 年。~~我离题了~~。

这篇文章中缺少的是我上次承诺的比较部分。我低估了我想在这篇文章中包含多少内容，以及我需要多少时间才能完成。在这一点上，我实在不想看到为了适应这一部分而进一步拖延和延伸的事情。如果右什么安慰的话，我最后在 Strata + Hadoop World Singapore 2015 上做了一个大规模数据处理的演变(The evolution of massive-scale data processing)的演讲(并且，将在6月份的 Strata + Hadoop World Singapore 2016 上给出它的更新版本)，这里面会提供缺失的比较部分的资料。幻灯片非常精美，[可以在这里找到](https://docs.google.com/presentation/d/10vs2PnjynYMtDpwFsqmSePtMnfJirCkXcHZ1SkwDg-s/present?slide=id.gd50fd6f86_0_224)供您阅读。~~Not quite the same, to be sure, but it’s something.~~

现在，继续 streaming (的话题)。

## 2. 回顾和路线图

在 Streaming 101 中，我首先澄清了一些术语。我首先区分了==有界数据==和==无界数据==。有界数据源的大小是有限的，通常被称为"批量"数据。无界数据可能具有无限大小，并且通常被称为"流式"数据。我尽量避免使用术语批处理和流式处理来指代数据源，因为这些名称带有某些具有误导性且通常具有限制性的含义。

然后我继续定义批处理引擎和流式处理引擎之间的区别：批处理引擎是那些在设计时只考虑有界数据的引擎，而流式引擎是在设计时考虑到无界数据的。我的目标是在提及执行引擎时仅使用术语 batch 和 streaming。

在术语之后，我介绍了与处理无界数据相关的两个重要的基本概念。我首先建立了事件时间(事件发生的事件)和处理时间(在处理过程中观察到的时间)之间的关键区别。这为 Streaming 101 中提出的主要论点之一奠定了基础：==如果您关心正确性和事件实际发生的上下文，则必须分析相对于固有事件时间的数据，而不是在分析过程中遇到它们的处理时间==。

然后我介绍了窗口化的概念(即，沿时间边界划分数据集)，这是一种常用的方法，用于应对技术上无界数据源可能永远不会结束的事实。一些更简单的窗口策略示例是固定窗口和滑动窗口，但更复杂的窗口类型，例如 session(窗口由数据本身的特征定义，例如，每隔一段时间捕获每个用户的活动会话)也可以看到广泛的用法。

除了这两个概念，我们现在将仔细研究另外三个概念:

- Watermarks(水位线)：水位线是关于事件时间的输入完整性的概念。时间值为 X 的水印表示："已观察到事件时间小于 X 的所有输入数据"。因此，当观察一个没有已知终点的无界数据源时，水位线可以作为一个进度指标。
- Triggers(触发器)：触发器是一种机制，用于声明相对于某些外部信号实现的窗口何时输出。触发器在选择何时发出输出时提供了灵活性。它还可以在窗口演变时多次观察窗口的输出。这又为随着时间的推移细化结果打开了大门，即允许在数据到达时提供推测结果以及处理上游数据（修订）随时间的变化或相对于水印较晚到达的数据(例如，移动场景，其中某人的手机在该人离线时记录各种动作及其事件时间，然后再重新连接时继续上传这些事件以进行处理)
- Accumulation(累积)：累积模式指定在同一窗口中观察到的多个结果之间的关系。这些结果可能完全脱节，即随着时间的推移代表独立的增量，或者它们之间可能存在重叠。不同的累积模式具有不同的语义和与之相关的成本，因此可以在各种用例中找到适用性。

最后，因为我认为为了使理解所有这些概念之间的关系变得更容易，我们将在回答四个问题的结构中重新审视旧的问题并探索新的问题，所有我提出的这些对每个无界数据处理的都至关重要：

- ***What* results are calculated?** 这个问题由 pipeline(管道) 中的转换类型来回答。这包括了计算总和、构建histograms、训练机器学习模型等等。 这本质上也是经典批处理回答的问题。
- ***Where* in event time are results calculated?** pipeline 中的事件时间窗口的使用回答了这个问题。这包括 Streaming 101 中的窗口（fixed，sliding，以及 session）常见示例，没有窗口概念的用例(例如，Streaming 101 中描述的与时间无关的处理；经典的批处理通常也属于这一类)和其他更复杂的窗口类型，例如，限时拍卖。另外请注意，如果将进入时间指定为记录到达系统时的事件时间，那它也可以包括处理时间窗口。
- ***When* in processing time are results materialized?** 这个问题是通过 Watermark(水位线) 和 Triggers(触发器) 的使用来回答。这个主题有无限的可能，但最常见的模式是使用 Watermark 来描绘给定窗口的输入何时结束，使用 Triggers 允许指定早期结果(对于在窗口完成之前发出的推测结果)和最终结果(Watermark 只是对完整性情况的估计，在 Watermark 声称给定窗口的输入完成后，可能会到达更多输入数据)
- ***How* do refinements of results relate?** 这个问题由所使用的累积类型来回答：丢弃(结果都是独立且不同的)，累积(后来的结果建立在先前的结果之上)，或者累积并回收(累积值和先前触发的值的回撤都被发出)