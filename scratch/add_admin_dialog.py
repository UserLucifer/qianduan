import os

filepath = r"app\admins\management\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add imports for react-hook-form, zod, dialog, etc.
imports = """
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { createAdminUser } from "@/api/admin";
import { AdminRole } from "@/types/enums";
"""

if "import { useForm" not in content:
    content = content.replace('import { useCallback, useState } from "react";', 'import { useCallback, useState } from "react";\n' + imports)

# Create the CreateAdminDialog component string
dialog_component = """
const formSchema = z.object({
  username: z.string().min(3, "账号名至少3个字符"),
  password: z.string().min(6, "密码至少6个字符"),
  role: z.string().min(1, "请选择角色"),
});

function CreateAdminDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      await createAdminUser(values);
      setOpen(false);
      form.reset();
      onSuccess();
    } catch (err: any) {
      alert(err.message || "创建失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5e6ad2] text-white hover:bg-[#7170ff]">
          <Plus className="mr-2 h-4 w-4" />
          新增管理员
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0f1011] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>新增系统管理员</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账号名</FormLabel>
                  <FormControl>
                    <Input placeholder="输入登录账号" className="bg-white/5 border-white/10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>初始密码</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="输入密码" className="bg-white/5 border-white/10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>系统角色</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="选择权限角色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AdminRole.SUPER_ADMIN}>超级管理员 (SUPER_ADMIN)</SelectItem>
                      <SelectItem value={AdminRole.FINANCE}>财务专员 (FINANCE)</SelectItem>
                      <SelectItem value={AdminRole.MAINTAINER}>系统运维 (MAINTAINER)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={submitting} className="bg-[#5e6ad2] text-white hover:bg-[#7170ff]">
                {submitting ? "提交中..." : "确认创建"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"""

if "function CreateAdminDialog" not in content:
    content = content.replace("export default function AdminUsersPage", dialog_component + "export default function AdminUsersPage")


# Update PageHeader in AdminUsersPage
content = content.replace(
    '''<PageHeader
        eyebrow="USER OPS"
        title="用户管理"
        description="查询用户、查看用户详情，并执行启用或禁用等高风险操作。"
      />''',
    '''<PageHeader
        eyebrow="USER OPS"
        title="用户与管理员管理"
        description="查询用户、查看用户详情，并执行启用或禁用等高风险操作。"
        actions={<CreateAdminDialog onSuccess={reload} />}
      />'''
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
