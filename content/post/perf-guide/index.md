---
title: perf性能分析工具的使用
description: 利用perf寻找程序的性能瓶颈，有针对性地进行性能优化
slug: perf性能分析工具的使用
date: 2025-03-14T01:40:52.569Z
image: "image.png"
categories:
    - Tips
tags:
    - Ubuntu
draft: false
---

## 安装依赖
**perf**：通常已经安装在大多数 Linux 系统中。

```bash
sudo apt-get install linux-tools-common linux-tools-generic
```

**Flamegraph**：由 Brendan Gregg 创建的工具集，用于生成火焰图。

```bash
git clone https://github.com/brendangregg/Flamegraph.git
cd Flamegraph
sudo chmod +x *.pl
echo 'export PATH="$PATH":'$(pwd) >> ~/.bashrc # 添加环境变量
source ~/.bashrc
```

## perf使用教程
1. 使用 `perf` 工具进行性能采样， Ctrl+C结束。

```bash
sudo sysctl -w kernel.kptr_restrict=0    # 暂时允许对内核符号的访问
sudo sysctl -w kernel.perf_event_paranoid=-1

perf record -F 99 -a -g -- ./my_program
```

> `F 99` 设置采样频率为每秒 99 次。
> `a` 表示对系统中的所有 CPU 进行采样。
> `g` 表示启用调用图（call graph）收集。

2. 将这些数据转换为火焰图格式,再转化为折叠格式：

```bash
perf script > out.perf

```

3. 转到 `Flamegraph` 的目录，将 `out.perf` 中的性能数据转换为折叠格式，并输出到 `out.folded` 文件。
    
```bash
./stackcollapse-perf.pl out.perf > out.folded

```
    
4. 生成火焰图：
    
```bash
./flamegraph.pl out.folded > flamegraph.svg

```

5. 将火焰图拖拽到浏览器即可查看

## 一键perf分析脚本
{{< popup-details title="展开复制保存为`perf_it.sh`" >}}
```bash
#!/bin/bash

# 确保传入的命令参数
if [ -z "$1" ]; then
    echo "Usage: $0 <command_to_profile>"
    exit 1
fi

# 暂时允许对内核符号的访问
sudo sysctl -w kernel.kptr_restrict=0

# 运行 perf record
perf record -F 99 -a -g -- "$1"

# 生成时间戳目录
export tmp_time=$(date +"%Y%m%d_%H%M%S")
export tmp_dir="flame_$tmp_time"
mkdir -p "$tmp_dir"
cd "$tmp_dir" || exit 1  # 避免 cd 失败

# 生成 perf 数据
perf script > "$tmp_time.perf"

# 生成折叠数据
stackcollapse-perf.pl "$tmp_time.perf" > "$tmp_time.folded"

# 生成火焰图
flamegraph.pl "$tmp_time.folded" > "flamegraph_$tmp_time.svg"

echo "🔥 火焰图生成完毕：$tmp_dir/flamegraph_$tmp_time.svg"
```
{{< /popup-details >}}
用法：
```bash
./perf_it ./my_program
```