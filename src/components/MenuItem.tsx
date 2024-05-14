const MenuItem = ({
  title,
  id,
  selectedId,
  Icon,
  onClick,
}: {
  title: string
  id: string
  selectedId: string
  Icon: React.ElementType
  onClick: (id: string) => void
}) => {
  const isSelected = id === selectedId

  const handleClick = () => {
    onClick(id)
  }

  return (
    <li>
      <a
        className={`text-base ${isSelected ? "active" : ""}`}
        onClick={handleClick}
      >
        <Icon color={isSelected ? "#ffffff" : "#000000"} />
        {title}
      </a>
    </li>
  )
}

export default MenuItem
