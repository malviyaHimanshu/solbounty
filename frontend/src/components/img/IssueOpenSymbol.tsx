export default function IssueOpenSymbol({
  height = '16',
  color = '#000',
}) {
  return (
    <svg
      aria-hidden="true"
      height={height}
      style={{ width: 'auto' }}
      viewBox="0 0 16 16"
      version="1.1"
      data-view-component="true"
      className="octicon octicon-issue-opened flex-items-center mr-1"
    >
      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill={color}></path>
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" fill={color}></path>
    </svg>
  );
}
