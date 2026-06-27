"use client";

import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const PROMPTS = [
  { title: "SaaS 协作工具", desc: "团队项目管理和协作平台的落地页" },
  { title: "个人作品集", desc: "设计师/开发者 Portfolio 展示页" },
  { title: "移动应用推广", desc: "App 下载推广页，含功能介绍和截图展示" },
  { title: "在线课程", desc: "教育课程销售页，含课程大纲和讲师介绍" },
  { title: "开源项目", desc: "GitHub 开源项目介绍页，含特性展示和快速开始" },
  { title: "餐厅品牌", desc: "精致餐厅品牌页，含菜单展示和预约功能" },
];

interface QuickPromptsProps {
  onSelect: (text: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
      {PROMPTS.map((p) => (
        <Card
          key={p.title}
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-border/50"
          onClick={() => onSelect(`帮我设计一个${p.title}的落地页。${p.desc}`)}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium text-sm">{p.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
