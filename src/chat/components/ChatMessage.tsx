import clsx from 'clsx'
import NextLink from 'next/link'
import { Children, ReactElement, cloneElement, memo } from 'react'

import { Message } from '../types'

import { Avatar } from '@src/components/Avatar'
import { useUserData } from '@src/context/UserContext'
import { useSmallAvatar } from '@src/profile/useAvartar'
import { Link } from '@src/ui/Link'
import { toThDate } from '@src/utils/time'

export interface ChatMessageProps {
  messageAbove: Message | undefined
  messageData: Message
  messageBelow: Message | undefined
}

export const ChatMessage = memo(
  (props: ChatMessageProps) => {
    const {
      messageAbove,
      messageData: { message, user: sender, creationDate },
      messageBelow,
    } = props

    const { user } = useUserData()
    const isSelf = user?.id === sender.id
    const isOther = !isSelf
    const shouldDisplayDate =
      !messageAbove ||
      new Date(messageAbove.creationDate).getDay() !==
        new Date(creationDate).getDay()
    const groupedWithTop =
      !shouldDisplayDate && messageAbove?.user.id === sender.id
    const isSameDateAsBelow =
      !!messageBelow &&
      new Date(messageBelow.creationDate).getDay() ===
        new Date(creationDate).getDay()
    const groupedWithBottom =
      isSameDateAsBelow && messageBelow?.user.id === sender.id
    const displayName = isOther && !groupedWithTop
    const displayAvatar = isOther && !groupedWithBottom
    const isEmoji = emojiPattern.test(message) && message.length <= 12

    return (
      <div>
        {shouldDisplayDate && (
          <div className="mt-2 flex justify-center text-xs text-gray-500">
            {new Date(creationDate).toLocaleDateString('th-TH', {
              minute: '2-digit',
              hour: '2-digit',
              day: 'numeric',
              month: 'short',
            })}
          </div>
        )}
        <div
          className={clsx(
            'flex items-end',
            isOther ? 'flex-row' : 'flex-row-reverse',
            groupedWithTop ? 'mt-0.5' : 'mt-2'
          )}
        >
          {displayAvatar ? (
            <SmallAvatar userId={sender.id} name={sender.showName} />
          ) : (
            isOther && <div className="mr-1 min-w-6" />
          )}
          <div className="flex flex-col items-start">
            {displayName && (
              <div className="max-w-[270px] px-1 text-xs text-gray-500 line-clamp-3">
                {sender.showName}
              </div>
            )}
            {isEmoji ? (
              <div
                title={toThDate(creationDate)}
                className={clsx(
                  'whitespace-pre-wrap text-4xl word-break',
                  isSelf ? 'ml-7' : 'mr-7'
                )}
              >
                {message}
              </div>
            ) : (
              <div
                title={toThDate(creationDate)}
                className={clsx(
                  'whitespace-pre-wrap rounded-2xl border px-2 py-1 word-break',
                  isSelf
                    ? 'ml-7 border-otog bg-otog text-white'
                    : 'mr-7 border-gray-100 bg-gray-100 dark:border-alpha-white-300 dark:bg-gray-800',
                  groupedWithTop &&
                    (isSelf ? 'rounded-tr-md' : 'rounded-tl-md'),
                  groupedWithBottom &&
                    (isSelf ? 'rounded-br-md' : 'rounded-bl-md')
                )}
              >
                {formatParser(message)}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
  (prevProps, nextProps) =>
    prevProps.messageAbove?.id === nextProps.messageAbove?.id &&
    prevProps.messageData.id === nextProps.messageData.id &&
    prevProps.messageBelow?.id === nextProps.messageBelow?.id
)

export const emojiPattern =
  /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/

const SmallAvatar = ({ userId, name }: { userId: number; name: string }) => {
  const { url } = useSmallAvatar(userId)
  return (
    <NextLink href={`/profile/${userId}`} passHref legacyBehavior>
      <Avatar className="mr-1 cursor-pointer" src={url} name={name} />
    </NextLink>
  )
}

const MessageCode = (token: string) => (
  <code className="bg-transparent text-inherit dark:bg-alpha-black-300">
    {token}
  </code>
)

const matcher: Record<
  string,
  { match: string; formatter: (token: string) => ReactElement }
> = {
  _: { match: '_', formatter: (token) => <i>{token}</i> },
  '~': { match: '~', formatter: (token) => <s>{token}</s> },
  '*': { match: '*', formatter: (token) => <b>{token}</b> },
  '`': {
    match: '`',
    formatter: MessageCode,
  },
  '[': {
    match: ']',
    formatter: (token) => (
      <Link href={token} isExternal className="!text-inherit underline">
        {token}
      </Link>
    ),
  },
}

const formatted = (token: string, format: string) => {
  return matcher[format]?.formatter(token) ?? <>{token}</>
}

const formatParser = (message: string) => {
  const tokens: ReactElement[] = []
  let token = ''
  let format = ''
  for (let i = 0; i < message.length; i++) {
    if (format && matcher[format].match === message[i]) {
      tokens.push(formatted(token.slice(1), format))
      format = ''
      token = ''
    } else if (!format && message[i] in matcher) {
      tokens.push(<>{token}</>)
      format = message[i]
      token = message[i]
    } else {
      token += message[i]
    }
  }
  if (token) {
    tokens.push(<>{token}</>)
  }
  return Children.map(tokens, (child, index) =>
    cloneElement(child, { key: index })
  )
}
