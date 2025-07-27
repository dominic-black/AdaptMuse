import Modal from "@/components/shared/Modal/Modal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { GeneratingAudienceAnimation } from "@/components/animations/audience/GeneratingAudienceAnimation";

export const AudienceCreatedModal = ({
  showAudienceModal,
  audienceFingerprint,
}: {
  showAudienceModal: boolean;
  audienceFingerprint: any | null;
}) => {
  console.log("audienceFingerprint = ", audienceFingerprint);
  return (
    <Modal
      isOpen={showAudienceModal}
      onClose={() => {}}
      label=""
      showCloseButton={false}
    >
      <div className="flex flex-col justify-between items-between gap-4 h-full">
        {!!audienceFingerprint ? (
          <div className="flex flex-col gap-4 w-full">
            <p className="font-semibold text-lg text-center">
              Audience created successfully
            </p>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                alt="Audience created"
                width={100}
                height={100}
              />
              <p>{audienceFingerprint.audienceName}</p>
            </div>
            <div className="flex flex-col gap-10 w-full">
              <div className="w-full h-60">
                <p>Age</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={Object.entries(audienceFingerprint.ageTotals).map(
                      ([key, value]) => ({
                        name: key,
                        value,
                      })
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={["dataMin", "dataMax"]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={70}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <ReferenceLine x={0} stroke="#000" />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full h-24">
                <p>Gender</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={Object.entries(audienceFingerprint.genderTotals).map(
                      ([key, value]) => ({
                        name: key,
                        value,
                      })
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={["dataMin", "dataMax"]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={70}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <ReferenceLine x={0} stroke="#000" />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-lg text-center">
                Creating target audience fingerprint
              </p>
              <div className="flex justify-center items-center w-full h-60">
                <GeneratingAudienceAnimation width={300} height={300} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
