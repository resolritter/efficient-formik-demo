import React from "react"
import "./App.css"
import { Field, Form, withFormik } from "formik"
import { shallowEqual } from "fast-equals"
import { cloneDeep, zipObject } from "lodash"

const fieldIds = ["firstName", "lastName"]
const memoizedFieldIds = fieldIds.map((f) => `MEMOIZED__${f}`)
const allFieldIds = fieldIds.concat(memoizedFieldIds)
const fieldIdMap = zipObject(allFieldIds, allFieldIds)

const formikFieldComparison = (prevProps, nextProps) => {
  const differences = {}
  for (const nextProp in nextProps) {
    if (nextProp === "form") {
      continue
    }
    if (!shallowEqual(prevProps[nextProp], nextProps[nextProp])) {
      differences[nextProp] = {
        previous: cloneDeep(prevProps[nextProp]),
        current: cloneDeep(nextProps[nextProp]),
      }
    }
  }

  const isChanged = Object.keys(differences).length
  if (isChanged) {
    console.log(
      `Field ${prevProps.field.name} has changed, here's the diff`,
      differences,
    )
    return false
  }

  return true
}

const useRenderCounter = (targetId) => {
  const count = React.useRef(-1)
  count.current = count.current + 1
  const syncCount = React.useRef(0)
  const pollUntilElementAppears = React.useRef()

  React.useLayoutEffect(() => {
    syncCount.current += 1

    const setRenderingInformation = () => {
      const target = document.getElementById(targetId)
      if (!target) return

      target.innerHTML = `Field ${targetId} has been re-rendered ${syncCount.current} times`
      clearInterval(pollUntilElementAppears.current)
      return true
    }
    if (!setRenderingInformation()) {
      clearInterval(pollUntilElementAppears.current)

      pollUntilElementAppears.current = setInterval(
        setRenderingInformation,
        200,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count.current, syncCount, targetId])
}

const DemoField = (initialProps) => ({ field, meta, targetId }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useRenderCounter(targetId)

  return (
    <div>
      <input type="text" autoComplete={"off"} {...initialProps} {...field} />
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </div>
  )
}

const FirstName = DemoField({ placeholder: "First name" })
const MemoFirstName = React.memo(FirstName, formikFieldComparison)

const LastName = DemoField({ placeholder: "Last name" })
const MemoLastName = React.memo(LastName, formikFieldComparison)

const wrapWithFormik = withFormik({
  mapPropsToValues: () => ({
    firstName: "Johnnie",
    lastName: "Walker",
  }),
})
const MemoizedSomeForm = wrapWithFormik(() => {
  return (
    <Form>
      <Field name="firstName">
        {React.useCallback(
          (props) => (
            <MemoFirstName
              {...props}
              targetId={fieldIdMap.MEMOIZED__firstName}
            />
          ),
          [],
        )}
      </Field>
      <Field name="lastName">
        {React.useCallback(
          (props) => (
            <MemoLastName {...props} targetId={fieldIdMap.MEMOIZED__lastName} />
          ),
          [],
        )}
      </Field>
    </Form>
  )
})
const SomeForm = wrapWithFormik(() => {
  return (
    <Form>
      <Field name="firstName">
        {React.useCallback(
          (props) => (
            <FirstName {...props} targetId={fieldIdMap.firstName} />
          ),
          [],
        )}
      </Field>
      <Field name="lastName">
        {React.useCallback(
          (props) => (
            <LastName {...props} targetId={fieldIdMap.lastName} />
          ),
          [],
        )}
      </Field>
    </Form>
  )
})

const RenderCounter = React.memo(
  () => {
    return (
      <div>
        {allFieldIds.map((f) => {
          return <div key={f} id={f}></div>
        })}
      </div>
    )
  },
  () => true,
)

function App() {
  return (
    <main className="App">
      <section>
        <p>
          This form <em>IS</em> memoized.
        </p>
        <p>
          This means that changing one field will <em>NOT</em> re-render other
          fields. The diffs between updates will be shown in the DevTools'
          Console tab.
        </p>

        <MemoizedSomeForm />
      </section>
      <hr />
      <section>
        <p>
          This form is <em>NOT</em> memoized.
        </p>
        <p>
          This means that changing one field <em>WILL</em> re-render other
          fields. Observe that, when you change one field, both of their
          rendering counters both increase in the{" "}
          <strong>Rendering statistics</strong>.
        </p>
        <SomeForm />
      </section>
      <hr />
      <section>
        <strong>Render statistics</strong>
        <RenderCounter />
      </section>
    </main>
  )
}

export default App
