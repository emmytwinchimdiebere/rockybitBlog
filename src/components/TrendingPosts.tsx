import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface TrendingPostProps {
  title: string;
  views: number;
}

export default function TrendingPost({ title, views }: TrendingPostProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Eye className="w-4 h-4 mr-1" />
          <span>{views.toLocaleString()} views</span>
        </div>
      </CardContent>
    </Card>
  );
}
