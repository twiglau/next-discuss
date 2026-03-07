import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { CommentListType } from "@/prisma/validate-schema";
import { format } from "date-fns";

type CommentBoxProps = {
  comment: CommentListType;
  children?: React.ReactNode;
}
export default function CommentBox({comment, children}: CommentBoxProps) {
    return <Card className="w-full py-2">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={comment.user.image || ""}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{comment.user.name}</h4>
            <h5 className="text-small tracking-tight text-default-400">{format(comment.createdAt, "PPP")}</h5>
          </div>
        </div>
        <Button
          color="primary"
          radius="full"
          size="sm"
        >
          回复
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p className="line-clamp-3">{comment.content || ""}</p>
        {children}
      </CardBody>
    </Card>
}