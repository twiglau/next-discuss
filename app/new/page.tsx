import { Button, Input, Textarea } from "@heroui/react"


export default function NewTopicPage({isTitle = true}:{isTitle:boolean}) {

  const handleSubmit = () => {}
  return (
    <div className="flex justify-center items-center">
      {isTitle && <h1 className="text-xl text-center">创建话题</h1>}
      <form className="max-w-sm" onSubmit={handleSubmit}>
        <Input 
        name="title"
        label="话题"
        labelPlacement="outside"
        isInvalid={true}
        errorMessage={""}
        />
        <Textarea
        name="content"
        label="话题内容"
        labelPlacement="outside"
        isInvalid={true}
        errorMessage={""}
        />
        <Button className="w-full" color="secondary" type="submit">确认</Button>
      </form>
    </div>
  )
}