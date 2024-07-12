import "./input.scss";

interface InputProps {
  text: string;
  setText: Function;
  type: string;
  placeholder: string;
  callBackFocus: Function;
}

const Input = ({ text, setText, type, placeholder, callBackFocus }: InputProps) => {
  const handleChangeText = (e: any) => {
    const text = e.target.value;
    setText(text);
  };

  return (
    <input
      placeholder={placeholder}
      type={type}
      className="component__input"
      value={text}
      onChange={handleChangeText}
      onKeyDown={e => {
        if (e.key === "Enter") {
          callBackFocus();
        }
      }}
    />
  );
};
export default Input;
