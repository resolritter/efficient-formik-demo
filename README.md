# Motivation

This repository demonstrates how to efficiently render Formik-powered forms
without losing on practicality or having to do lots of setup.

# Problem

_Note: The relevant part of the code for this explanation should be in
`src/App.js`._

Formik passes down the `form` prop to each field, which isn't helpful for
controlling the rendering efficiently, since that prop will change on every
user-triggered change for all fields. This project makes use of a custom
function called `formikFieldComparison`, which will skip updates if only `form`
changes. The code shows a way of easily applying this pattern without having to
rely on custom HOCs or roundabout ways which would otherwise lead to unpleasant
usage patterns.

As a side note, instead of skipping the `form` prop inside of
`formikFieldComparison`, one might argue you could just as well not pass that
prop to the field components; there're some downsides to this idea:

- Doing it for every single component leads to unneeded repetition.
- Repeating the same code for every component would incur huge manual changes
  everywhere should the Formik API change in the future. By handling Formik's
  particularities inside of that function only, it leads to a cleaner separation
  of concern and more concise API surface overall, since it hides this
  implementation detail which isn't at all relevant for the intended use-case.

Note that it's not needed to rely on the `form` prop _even_ if a field is
interested only in some part of the whole form's state. Instead, you can extract
only the values you need in the parent and pass it down as a prop to that
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
