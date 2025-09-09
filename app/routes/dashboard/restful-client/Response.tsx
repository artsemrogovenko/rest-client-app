export default function ResponseComponent() {
  return (
    <aside className="flex flex-col gap-2 rounded-lg border p-5 w-[362px] h-full">
      <h3>Response</h3>
      <div className="flex flex-col gap-2 rounded-lg border p-2 h-full">
        <span className="rounded-lg border p-2">Status: </span>
        <h4>Body</h4>
        <p className="break-all"></p>
      </div>
    </aside>
  );
}
