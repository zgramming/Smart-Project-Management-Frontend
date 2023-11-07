import AdminLayout from "@/components/layout/AdminLayout";

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Dashboard">{page}</AdminLayout>;
};

export default function Page() {
  return <></>;
}
