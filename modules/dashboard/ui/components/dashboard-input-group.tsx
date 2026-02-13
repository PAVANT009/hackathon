"use client"

import { useRef, ChangeEvent, useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { AudioLines, Plus } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"

export function InputGroupCustom() {
  const [input,setInput] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="grid w-full gap-6">
      <InputGroup>
        <TextareaAutosize
          onChange={handleChange}
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Autoresize textarea..."
        />
        <InputGroupAddon align="block-end">
        {
          input.trim() !== "" ? (
            <InputGroupButton className="ml-auto" size="sm" variant="default">
            Submit
          </InputGroupButton>
          ): (
          <InputGroupButton className="ml-auto" size="sm" variant="default">
            <AudioLines/>
          </InputGroupButton>
          )
        }
          
        </InputGroupAddon>
      </InputGroup>

      {/* Hidden file input */}
    </div>
  )
}
