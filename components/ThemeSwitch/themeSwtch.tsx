import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className="day-night-container bg-[#e9786b] dark:bg-[#2a2c36] shadow-lg"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div className="sun opacity-1 top-[39px] dark:opacity-0 dark:top-[100px] "></div>
      <div className="moon left-[120%] top-[-50%] dark:left-[26px] dark:top-[24px]">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="stars opacity-0 dark:opacity-100">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="water bg-[#71baf2] dark:bg-[#7fa1bb]"></div>
    </div>
  );
};

export default ThemeSwitch;
