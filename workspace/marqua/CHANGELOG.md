# marqua changelog

## Unreleased

- [#58](https://github.com/ignatiusmb/marqua/pull/58): add `sort` option to `chain`
- [#58](https://github.com/ignatiusmb/marqua/pull/58): fix `chain` extends strictness
- [#56](https://github.com/ignatiusmb/marqua/pull/56): fix nested objects metadata

## 0.4.1 - 2023/01/25

- [#53](https://github.com/ignatiusmb/marqua/pull/53): remove `"postinstall"` script

## 0.4.0 - 2023/01/20

- [#52](https://github.com/ignatiusmb/marqua/pull/52): specify `"engines"` field
- [#51](https://github.com/ignatiusmb/marqua/pull/51): add `construct` function to core
- [#49](https://github.com/ignatiusmb/marqua/pull/49): decouple parser and fs modules
- [#47](https://github.com/ignatiusmb/marqua/pull/47): amalgamate `aqua` as the artisan
- [#45](https://github.com/ignatiusmb/marqua/pull/45): add `parse` function to core
- [#42](https://github.com/ignatiusmb/marqua/pull/42): fix types to properly reflect data

### Breaking Changes

- [#52](https://github.com/ignatiusmb/marqua/pull/52) | Require minimum of Node v14.8
- [#51](https://github.com/ignatiusmb/marqua/pull/51) | Added `construct` function
  - Removed automatic array conversion when `,` exists
  - Reserved `,` only when pair-value is wrapped in brackets
- [#49](https://github.com/ignatiusmb/marqua/pull/49) | Decouple modules
  - Moved `compile` / `traverse` from `'marqua'` to `'marqua/fs'`
  - Renamed `toc` / `read_time` to `table` / `estimate`
  - Changed `recurse: boolean` to `depth: number`, use `depth: -1` for the same behaviour
  - Renamed `DirOptions` to `TraverseOptions`, removes `FileOptions` inheritance
  - Removed `FileOptions` interface, `compile` receives single entry `string`
  - Removed `traverse` union input, now solely accepts `TraverseOptions`
- [#47](https://github.com/ignatiusmb/marqua/pull/47) | Amalgamate `aqua`
  - Moved `marker` from `'marqua'` to `'marqua/artisan'`
- [#45](https://github.com/ignatiusmb/marqua/pull/45) | Added `parse` function
  - Commas `,` in front matter no longer splits values into array

## 0.3.1 - 2022/07/29

- [#41](https://github.com/ignatiusmb/marqua/pull/41): support native ESM resolution

## 0.3.0

- [#23](https://github.com/ignatiusmb/marqua/pull/23): revert metadata injection
- [#20](https://github.com/ignatiusmb/marqua/pull/20): reverse breadcrumb items

## 0.2.2

- [#16](https://github.com/ignatiusmb/marqua/pull/16): add traverse sort option

## 0.2.1

- [#18](https://github.com/ignatiusmb/marqua/pull/18): guard marqua data types for index signatures
- [#12](https://github.com/ignatiusmb/marqua/pull/12): add automatic date metadata

## 0.2.0

- [#10](https://github.com/ignatiusmb/marqua/pull/10): add advanced typings for autocompletion
- [#10](https://github.com/ignatiusmb/marqua/pull/10): export new `forge` helper
- [#8](https://github.com/ignatiusmb/marqua/pull/8): (breaking) change `filename` to `breadcrumb`
- [#8](https://github.com/ignatiusmb/marqua/pull/8): add recursive parsing to `traverse`
- [#8](https://github.com/ignatiusmb/marqua/pull/8): remove `.sort` when calling `traverse`

## 0.1.2

- [#7](https://github.com/ignatiusmb/marqua/pull/7): change `pathname` and `dirname` to `entry`
- [#7](https://github.com/ignatiusmb/marqua/pull/7): fix rendered markups not having styles

## 0.1.1

- [06dd60d](06dd60d9eddf6c0125f91088117f21119b66f71a): fix infinite loop in Vite due to circular dependence

## 0.1.0

- add `compile` and `traverse` to top-level imports
- export `marker` to allow individual customization
- automatic table of contents generation
- automatic generated read time duration
- automatic generated id appended to headings
