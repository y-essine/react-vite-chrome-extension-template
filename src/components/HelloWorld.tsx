import useCounter from "@/store/useCounter"

export default function HelloWorld(props: { msg: string }) {
  const { counter, increment } = useCounter()

  return (
    <>
      <h1>{props.msg}</h1>

      <div className="card">
        <button type="button" onClick={increment}>
          count is
          {' '}
          {counter}
        </button>
        <p>
          Edit
          <code>src/components/HelloWorld.tsx</code>
          {' '}
          to test HMR
        </p>
      </div>

      <p>
        Check out
        <a href="https://github.com/crxjs/create-crxjs" target="_blank" rel="noreferrer">create-crxjs</a>
        , the official starter
      </p>

      <p className="read-the-docs">
        Click on the Vite, React and CRXJS logos to learn more
      </p>
    </>
  )
}
