---
title: 什么是H.265
author: SnailDev
tags:
  - 随手写写
categories:
  - 图像影音
date: 2018-07-16 10:26:00
featured_image: /images/h.265_1.jpg
---
![xh265-vid-top jpg pagespeed gp jp jw pj ws js rj rp rw ri cp md ic saoisp96-x](/images/h.265_1.jpg)

最近偶然读了一篇文章[一位女运维的自述：3年为公司节省10亿元！](https://mp.weixin.qq.com/s/z5y4NUr_lE_cY6FMSaIRUw)，大意是腾讯运维如何运用图像影音压缩技术为公司和用户节省了大量流量，节约了成本并提高了用户体验。其中关键技术 **_H.265_** 吸引了我的注意，于是百谷歌度了一番，做了一个大致的了解。

<!-- more -->

[4K is the next big thing in TVs](https://www.howtogeek.com/206662/should-you-get-an-ultra-hd-4k-tv/), 和 [4K videos are starting to pop up everywhere](https://www.howtogeek.com/300847/where-can-you-find-4k-video-for-your-4k-tv/). 但由于4K视频占用了大量的空间，很难以最佳质量进行下载和流式传输，而值得庆幸的是，一种被称为高效视频编码技术（High Efficiency Video Coding (HEVC), or H.265）正在改变这种情况。

这项新技术还需要很长一段时间才能得到大范围的应用，目前它正出现在—4K UHD Blu-rays 使用  HEVC, [VLC 3.0](https://www.videolan.org/vlc/releases/3.0.0.html)使得你PC机上的HEVC 和 4K 视频更加清晰，iPhone 设备甚至可以用HEVC技术记录视频以节约存储空间。但它是如何工作的，为什么对4K视频如此重要？

## 1. 当前标准：AVC / H.264
当你观看蓝光光盘，YouTube视频或者来自ITunes的电影时，它与来自编辑室的原始视频不是完全相同的。为了是该电影或者视频更适合蓝光光盘——或者使其足够小以便在网上轻松下载——必须对电影压缩。
高级视频编码也被称为AVC或H.264,是广泛使用的视频压缩的最佳标准，并且有几种不同的方法可用于减小视频文件的大小。
例如，在任何给定的帧中，它可以查找大多数颜色相同的区域。在我和我儿子的这幅禁止帧中——大部分的天空都是相同的蓝色，因此压缩算法可以将图像分割成块——称之为“macroblocks”——并表明“我们仅仅假设沿着顶部的所有这些块都是相同的蓝色以替代记录每个像素的颜色”。这比存储每个单独像素的颜色效率更高，降低最终图像的文件大小。在视频中， 该技术被称之为帧内压缩——压缩单个帧的数据。

![img_1617-1](/images/h.265_2.jpg)


AVC还使用帧间压缩，它可以查看多个帧并记录帧的哪些部分正在改变 - 哪些不是。从“美国队长：内战”中获得这一镜头。 背景并没有太大的变化 - 帧之间的差异大部分来自钢铁侠的脸部和身体。 所以，压缩算法可以将帧分成相同的宏块，并表明“你知道什么？ 这些块不会改变100帧，所以让我们再次显示它们，而不是将整个图像存储100次。“这可以显著减小文件大小。

![5af0120085a6c_5af012009aeab](/images/h.265_3.gif)


这些只是AVC / H.264使用方法的两个过度简化的例子，但您清楚了其中的原理。 这完全是为了在不影响质量的情况下提高视频文件的效率。 （当然，如果压缩太多，任何视频都会失去质量，但这些技术越聪明，在您进入该点之前就可以压缩越多。）

## 2. HEVC / H.265更高效地压缩视频，非常适合4K视频
高效视频编码技术也称为HEVC或H.265，是视频编码技术演进的下一步。 它的构建使用了AVC / H.264中的许多技术，使视频压缩效率更高。

举个例子，当AVC查看多个帧变更时（例如上面的美国队长例子），这些宏块“块”可以是几个不同的形状和大小，最多可达16个像素乘16个像素。 而使用HEVC，这些块可以达到64×64的尺寸 - 远远大于16×16，这意味着该算法可以记忆更少的块，从而减小整体视频的尺寸。

您可以在[HandyAndy Tech Tips](https://www.youtube.com/channel/UCD80RKxQODrPv-PdM3Js8IQ)的这个精彩视频中看到对这项技术的更多技术性解释.

当然，HEVC还有其他一些技术正在运用，但这是最大的改进之一 - 当所有事情说到做到之后，HEVC可以在相同的质量水平下将视频压缩两倍于AVC。 对于用AVC技术编码而占用大量空间的4K视频而尤其重要。 HEVC使4K视频更容易流式传输，下载或翻录到硬盘。


## 3. 缺陷：HEVC在没有硬件加速解码的情况下很慢
自2013年以来，HEVC一直是获批准的标准，那么为什么我们不能将它用于所有视频？
相关： [如何通过启用硬件加速使VLC使用更少的电量](https://www.howtogeek.com/260784/how-to-make-vlc-use-less-battery-life-by-enabling-hardware-acceleration/)
这些压缩算法非常复杂 - 在视频播放之前，需要花费大量的数学计算才能实现解码。 计算机有两种主要的方式可以解码在这种视频：一软件解码，它会使用你的计算机的CPU来完成这个数学运算，或者二[硬件解码](https://www.howtogeek.com/260784/how-to-make-vlc-use-less-battery-life-by-enabling-hardware-acceleration/) ，在这个解码过程中，它将负载交给你的图形卡（或者你的集成图形芯片中央处理器）。 只要显卡支持所尝试播放的视频的编解码器，则效率更高。

因此，尽管许多PC和程序都可以尝试播放HEVC视频，但是如果没有硬件解码，它可能会卡顿或者非常慢。 所以，除非你有一个支持HEVC硬件解码的图形卡和视频播放器，否则HEVC对你来说并不是很好。

这对于独立播放设备来说不是问题 - 包括Xbox One在内的4K蓝光播放机都是以HEVC为基础构建的。 但是当谈到在PC上播放HEVC视频时，事情变得更加困难。 您的计算机将需要以下硬件之一才能硬解码HEVC视频：

- 英特尔第六代“Skylake”或更新的CPU
- AMD第六代“Carizzo”或更新的APU
- NVIDIA GeForce GTX 950,960或更新的显卡
- AMD Radeon R9 Fury，R9 Fury X，R9 Nano或更新的显卡

您可能还需要使用不仅能支持HEVC视频，而且还支持HEVC硬件解码的操作系统和视频播放器 - 目前这有点多余。 许多玩家仍在增加对HEVC硬件解码的支持，并且在某些情况下，它可能仅适用于上面列表中的某些芯片。 在撰写本文时， [VLC](https://www.videolan.org/) 3.0， [Kodi](https://kodi.tv/) 17和[Plex Media Server](https://www.plex.tv/) 1.10都支持某种形式的HEVC硬件解码，至少对于某些卡而言。 不过，您可能必须在选择的播放器中[启用硬件加速](https://www.howtogeek.com/260784/how-to-make-vlc-use-less-battery-life-by-enabling-hardware-acceleration/)才能正常工作。

随着时间的推移，越来越多的计算机将能够处理这种视频，而更多的播放器将会更广泛地支持它 - 就像现在使用AVC / H.264一样。 它可能需要一段时间才会变得无处不在，在此之前，您必须以巨大的文件大小（或压缩它并丢失图像质量）将您的4K视频存储在AVC / H.264中。 但是，HEVC / H.265得到广泛支持越多，视频就越好。

## 4.参考
图片来源： [alphaspirit](https://www.shutterstock.com/image-photo/realism-sporting-images-broadcast-on-tv-725299213) /Shutterstock.com

本文翻译自：[What Is HEVC H.265 Video, and Why Is It So Important for 4K Movies?](https://www.howtogeek.com/342416/what-is-hevc-h.265-video-and-why-is-it-so-important-for-4k-movies/)
