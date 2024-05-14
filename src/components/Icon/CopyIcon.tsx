const CopyIcon = ({
  color,
  className,
}: {
  color?: string
  className?: string
}) => {
  return (
    <svg
      className={className ?? "h-6 w-6"}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2333"
    >
      <path
        d="M829.568 53.12H960V1024H194.432v-121.344H64V284.48L361.92 0h467.648v53.12z m0 80.896v768.64H279.488v40.448h595.456V134.016h-45.44zM149.056 317.952v503.808h595.456V80.896H397.248L149.12 317.952z"
        fill={color ?? "#ffffff"}
        p-id="2334"
      ></path>
    </svg>
  )
}

export default CopyIcon
