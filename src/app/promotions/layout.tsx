"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useSectionStore } from "@/store/useSectionStore";

export default function PromotionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId);
  });

  return (
    <>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <Breadcrumb pageName="Promotions" />
          
          <div className="mt-4">
            <h1 className="text-2xl font-semibold text-dark dark:text-white">
              {activeSection?.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gérez les promotions, les unités d'enseignement et les matières de votre section
            </p>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {children}
        </div>
      </div>
    </>
  );
}