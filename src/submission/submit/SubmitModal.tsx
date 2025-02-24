import NextLink from 'next/link'
import { FormEvent, useEffect } from 'react'

import { FileInput } from '../../components/FileInput'
import { submitProblem } from './queries'
import { useDropFile } from './useDropFile'

import { UseDisclosureReturn, useDisclosure } from '@src/hooks/useDisclosure'
import { useMutation } from '@src/hooks/useMutation'
import { Problem } from '@src/problem/types'
import { Button } from '@src/ui/Button'
import { FormLabel, Select } from '@src/ui/Input'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@src/ui/Modal'
import { onErrorToast } from '@src/hooks/useErrorToast'

export interface SubmitModalProps extends UseDisclosureReturn {
  problem: Problem
  onSuccess?: () => void
  submitted?: boolean
}

export interface SubmitReq {
  sourceCode: File
  language: 'c' | 'cpp' | 'python'
  contestId?: number
}

export const SubmitModal = (props: SubmitModalProps) => {
  const { problem, onClose, isOpen, onSuccess, submitted = false } = props

  const { file, resetFile, fileInputProps, getRootProps } = useDropFile()
  useEffect(() => {
    resetFile()
  }, [resetFile, problem.id])

  const submitProblemMutation = useMutation(submitProblem)
  const {
    isOpen: isLoading,
    onOpen: onLoad,
    onClose: onLoaded,
  } = useDisclosure()
  useEffect(() => {
    console.log(isLoading)
  }, [isLoading])
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading || !file) return
    try {
      onLoad()
      const language = new FormData(e.currentTarget).get('language') as string
      await submitProblemMutation(problem.id, file, language)
      resetFile()
      onSuccess?.()
      onClose()
    } catch (e) {
      onErrorToast(e)
    } finally {
      onLoaded()
    }
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <div {...getRootProps()}>
          <form onSubmit={onSubmit}>
            <ModalHeader>{problem.name}</ModalHeader>
            <ModalBody>
              <ModalCloseButton />
              <div className="flex flex-col gap-4">
                <div>
                  <FormLabel>อัปโหลด</FormLabel>
                  <FileInput name="sourceCode" {...fileInputProps} />
                </div>
                <div>
                  <FormLabel>ภาษา</FormLabel>
                  <Select name="language">
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="python">Python</option>
                  </Select>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex gap-2">
                <NextLink
                  href={`/problem/${problem.id}`}
                  passHref
                  legacyBehavior
                >
                  <Button as="a">{submitted ? 'แก้ไข' : 'ใหม่'}</Button>
                </NextLink>
                <Button colorScheme="otog" type="submit" disabled={isLoading}>
                  ส่ง
                </Button>
              </div>
            </ModalFooter>
          </form>
        </div>
      </ModalContent>
    </Modal>
  )
}
