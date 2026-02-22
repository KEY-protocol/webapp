"use client";

import { useState } from "react";
import { PenTool } from "lucide-react";
import { useTranslations } from "next-intl";
import EditTrainingModal from "./EditTrainingModal";

interface TrainingItem {
  id: number;
  title: string;
  modules: number;
  objectiveCount: number;
  objective: string;
  zone: string;
}

interface TrainingGridProps {
  initialData: TrainingItem[];
}

export default function TrainingGrid({ initialData }: TrainingGridProps) {
  const t = useTranslations("training_page");
  const [selectedTraining, setSelectedTraining] = useState<TrainingItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (training: TrainingItem) => {
    setSelectedTraining(training);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {initialData.map((training) => (
          <div
            key={training.id}
            className="bg-[#24421A] border border-white/5 rounded-3xl p-8 flex flex-col space-y-6 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-full p-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <PenTool className="w-8 h-8 text-[#24421A]" />
                </div>
                <h2 className="text-3xl font-bold font-montserrat tracking-tight">
                  {training.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleEdit(training)}
                className="border border-white/40 rounded-full px-5 py-1 text-xs font-bold tracking-widest hover:bg-white hover:text-[#24421A] hover:border-white transition-all duration-300 active:scale-95"
              >
                {t("edit_button")}
              </button>
            </div>

            <div className="space-y-1 pt-2">
              <p className="font-poppins text-xl">
                <span className="font-bold">{t("modules")}:</span>{" "}
                {training.modules}
              </p>
              <p className="font-poppins text-xl">
                <span className="font-bold">{t("objective")}:</span>{" "}
                {t("train_people", { count: training.objectiveCount })}
              </p>
              <p className="font-poppins text-xl">
                <span className="font-bold">{t("zone")}:</span> {training.zone}
              </p>
            </div>
          </div>
        ))}
      </div>

      <EditTrainingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        training={selectedTraining}
      />
    </>
  );
}
