import React, { useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
  EllipsisVerticalIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/app/components/base/button'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export type ISidebarProps = {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  onDeleteConversation?: (id: string) => void // Add this prop if you want to handle deletion
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  onDeleteConversation,
}) => {
  const { t } = useTranslation()

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setOpenMenuId(prev => (prev === id ? null : id))
  }
  
  return (
    <div
      className="shrink-0 flex flex-col overflow-y-auto bg-white pc:w-[244px] tablet:w-[192px] mobile:w-[240px]  border-r border-gray-200 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen"
    >
      {list.length < MAX_CONVERSATION_LENTH && (
        <div className="flex flex-shrink-0 p-4 !pb-0">
          <Button
            onClick={() => { onCurrentIdChange('-1') }}
            className="group block w-full flex-shrink-0 !justify-start !h-9 text-primary-600 items-center text-sm">
            <PencilSquareIcon className="mr-2 h-4 w-4" /> {t('app.chat.newChat')}
          </Button>
        </div>
      )}

      <nav className="mt-4 flex-1 space-y-1 bg-white p-4 !pt-0">
        {list.map((item) => {
          const isCurrent = item.id === currentId
          const ItemIcon = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon

          return (
            <div
              key={item.id}
              className={classNames(
                isCurrent
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
                'relative flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer'
              )}
            >
              <div
                className="flex-1 flex items-center"
                onClick={() => onCurrentIdChange(item.id)}
              >
                <ItemIcon
                  className={classNames(
                    isCurrent
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 flex-shrink-0',
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </div>
              
              {/* Three-dot button to toggle menu on click */}
              <div className="relative">
                <button
                  className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                  onClick={(e) => toggleMenu(e, item.id)}
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>

                {/* Dropdown menu only shown when openMenuId matches item.id */}
                {openMenuId === item.id && (
                  <div className="absolute right-0 top-8 z-10 w-28 py-1 bg-white rounded-md shadow-lg border border-gray-200">
                    <button
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        if (onDeleteConversation) {
                          onDeleteConversation(item.id)
                        }
                        setOpenMenuId(null) // Close after delete
                      }}
                    >
                      <TrashIcon className="h-4 w-4 mr-2 text-red-500" />
                      {t('app.chat.delete')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="flex flex-shrink-0 pr-4 pb-4 pl-4">
        <div className="text-gray-400 font-normal text-xs">© {copyRight} {(new Date()).getFullYear()}</div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
