import { cn } from '@/lib/utils'
import { PackageOpen } from 'lucide-react'

interface EmptyProps {
  description?: string
}

// Empty component
export default function Empty({ description = '暂无数据' }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-gray-500')}>
      <PackageOpen className="w-16 h-16 mb-4 text-gray-300" />
      <p className="text-lg">{description}</p>
    </div>
  )
}

export { Empty }
