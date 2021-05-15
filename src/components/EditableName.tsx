import { ButtonGroup, IconButton } from '@chakra-ui/button'
import {
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
} from '@chakra-ui/editable'
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import { Flex, HStack } from '@chakra-ui/layout'
import { useAuth } from '@src/utils/api/AuthProvider'
import { useHttp } from '@src/utils/api/HttpProvider'
import { UserProfile } from '@src/utils/api/User'
import { useErrorToast } from '@src/utils/hooks/useError'

interface EditableNameProps {
  userData: UserProfile
}

export const EditableName = (props: EditableNameProps) => {
  const { userData } = props
  const { user } = useAuth()

  const http = useHttp()
  const { onError } = useErrorToast()
  const onSubmit = async (showName: string) => {
    try {
      await http.patch(`user/${user?.id}/name`, { showName })
      await http.refreshToken(null)
    } catch (e) {
      onError(e)
    }
  }

  function EditableControls() {
    const { isEditing, getEditButtonProps } = useEditableControls()

    return isEditing ? null : (
      <IconButton
        size="sm"
        icon={<EditIcon />}
        {...getEditButtonProps()}
        aria-label="edit"
      />
    )
  }

  return user?.id === userData.id ? (
    <Editable
      defaultValue={user?.showName}
      isPreviewFocusable={false}
      onSubmit={onSubmit}
    >
      <HStack>
        <EditablePreview />
        <EditableInput />
        <EditableControls />
      </HStack>
    </Editable>
  ) : (
    <>{user?.showName}</>
  )
}
