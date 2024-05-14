const InputIcon = ({
  color,
  className,
}: {
  color?: string
  className?: string
}) => {
  return (
    <svg
      className={`h-5 w-5 ${className}` ?? "h-5 w-5"}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="8622"
    >
      <path
        d="M660.88 408.088l-44.968-44.968 331.2-331.2 44.968 44.968zM96 928h832V416h64v576H32V32h576v64H96v832z"
        fill={color ?? "#000000"}
        p-id="8623"
      ></path>
      <path
        d="M208 704v-64h560v64H208z m0-224h320v64H208v-64z"
        fill={color ?? "#000000"}
        p-id="8624"
      ></path>
    </svg>
  )
}

export default InputIcon
