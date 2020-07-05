# Motivation

This repository demonstrates how to efficiently render Formik-powered forms
without losing on practicality or having to do lots of setup.

# Problem

Formik passes down the `form` prop down to every field, which isn't helpful for
efficient renders, since that prop will change on every user input (thus causing
everything to re-render). In this project, the `formikFieldComparison` will
compare everything else aside from `form`, thus skipping unneeded updates to the
components. The code shows a way of easily achieving that without having to rely
on custom HOCs or roundabout ways which would otherwise lead to unpleasant usage
patterns.

Note that it's not needed to rely on the `form` prop even if some field is
interested in some part of the whole form's state. Instead, you can extract only
the part from `form` you need in the parent, then pass it down as a prop to that
particular field. For instance, if the field `motherSurname` should react to
changes in the `childSurname` field, opt for:

```javascript
// in the parent
const { values: { childSurname } } = useFormikContext()

<Field name="motherSurname">
  {({ form: _form, ...otherProps }) => (
    <MotherSurname {...otherProps} childSurname={childSurname} />
  )}
</Field>
```

You can also use `useMemo` or `useCallback` to memoize the extracted prop, if
necessary.

# Running

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

## Install dependencies

`yarn`

## Run the app

`yarn start`
