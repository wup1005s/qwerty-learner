import DictTagSwitcher from './DictTagSwitcher'
import DictionaryComponent from './DictionaryWithoutCover'
import { IconAddWord } from '@/pages/Typing/components/AddWord/icon/IconAddWord'
import { currentDictInfoAtom } from '@/store'
import type { Dictionary } from '@/typings'
import { findCommonValues } from '@/utils'
import { Empty, Link } from '@arco-design/web-react'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function DictionaryGroup({ groupedDictsByTag }: { groupedDictsByTag: Record<string, Dictionary[]> }) {
  const tagList = useMemo(() => Object.keys(groupedDictsByTag), [groupedDictsByTag])
  const [currentTag, setCurrentTag] = useState(tagList[0])
  const currentDictInfo = useAtomValue(currentDictInfoAtom)

  const onChangeCurrentTag = useCallback((tag: string) => {
    setCurrentTag(tag)
  }, [])

  useEffect(() => {
    const commonTags = findCommonValues(tagList, currentDictInfo.tags)
    if (commonTags.length > 0) {
      setCurrentTag(commonTags[0])
    }
  }, [currentDictInfo.tags, tagList])

  if (groupedDictsByTag[currentTag]) {
    return (
      <div>
        <DictTagSwitcher tagList={tagList} currentTag={currentTag} onChangeCurrentTag={onChangeCurrentTag} />
        <div className="mt-8 grid gap-x-5 gap-y-10 px-1 pb-4 sm:grid-cols-1 md:grid-cols-2 dic3:grid-cols-3 dic4:grid-cols-4">
          {groupedDictsByTag[currentTag].map((dict) => (
            <DictionaryComponent key={dict.id} dictionary={dict} />
          ))}
        </div>
      </div>
    )
  }
  // 不存在
  return (
    <div className="w-full">
      <DictTagSwitcher tagList={tagList} currentTag={currentTag} onChangeCurrentTag={onChangeCurrentTag} />
      <Empty
        className="mt-8 flex items-center"
        description={
          <div className="flex items-center justify-center">
            尚未添加单词数据，去
            <Link style={{ display: 'flex', alignItems: 'center' }}>
              <IconAddWord width={14} height={14} className="mr-1" />
              <NavLink to="/add-word">添加</NavLink>
            </Link>
          </div>
        }
      />
    </div>
  )
}
