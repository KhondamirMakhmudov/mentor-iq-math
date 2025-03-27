import Dashboard from "@/components/dashboard";

const Index = () => {
  return (
    <Dashboard headerTitle={"Математика"}>
      <div className="font-sf">
        <h2 className="font-semibold text-[22px] mb-[18px]">Темы/разделы</h2>

        <div className="grid grid-cols-12 gap-[24px]">
          <div className="col-span-6 border border-[#E9E9E9] rounded-[12px]">
            <ul className="border rounded-md w-full">
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9] bg-gray-100 ">
                I-глава. Натуральные числа и ноль
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                II-глава. Делимость натуральных чисел
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                III-глава. Дробные числа и действия над ними
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                IV-глава. Десятичные дроби. Применение операций с десятичными...
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                V-глава. Множество
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                VI-глава. Процент
              </li>
              <li className="p-[12px] pl-[24px] border-b border-b-[#E9E9E9]">
                VII-глава. Углы. Многоугольники
              </li>
              <li className="p-[12px] pl-[24px]">VIII-глава. Диаграмма</li>
            </ul>
          </div>

          <div className="col-span-6 border border-[#E9E9E9] rounded-[12px]"></div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
