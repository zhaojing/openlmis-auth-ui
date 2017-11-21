6.0.0 / 2017-11-09
==================

New functionality
* [OLMIS-2956:](https://openlmis.atlassian.net/browse/OLMIS-2956) Simplified login and authorization services by removing "user rights" functionality and moving to openlmis-referencedata-ui.

New functionality added in backwards-compatiable manner
* [OLMIS-3141:](https://openlmis.atlassian.net/browse/OLMIS-3141) After user resets their password, they are redirected to the login screen.
* [OLMIS-3283:](https://openlmis.atlassian.net/browse/OLMIS-3283) Added a "Show password" option on password reset screen.

Bug fixes which are backwards-compatible:
* [OLMIS-3140](https://openlmis.atlassian.net/browse/OLMIS-3140): Added loading icon on forgot password modal.

Improvements:
* Updated dev-ui version to 6.

5.0.3 / 2017-09-01
==================

New functionality added in backwards-compatiable manner
* [OLMIS-3085:](https://openlmis.atlassian.net/browse/OLMIS-3085) Added standard login and logout events.

Bug fixes and security updates:
* [OLMIS-3124](https://openlmis.atlassian.net/browse/OLMIS-3124): Removed openlmis-download directive and moved it to openlmis-ui-components
* [MW-348:](https://openlmis.atlassian.net/browse/MW-348) Added loading modal while logging in.
* [OLMIS-2871](https://openlmis.atlassian.net/browse/OLMIS-2871): Made the component use an Authorization header instead of an access_token request parameter when calls to the backend are made.
* [OLMIS-2867](https://openlmis.atlassian.net/browse/OLMIS-2867): Added message when user tries to log in while offline.

5.0.2 / 2017-06-22
==================

New functionality added in backwards-compatiable manner
* [OLMIS-2553](https://openlmis.atlassian.net/browse/OLMIS-2553): Removed login offline functionality and added warning when logging out while offline.

Bug fixes

* [OLMIS-2548](https://openlmis.atlassian.net/browse/OLMIS-2548): Fixed lack of loading modal after re-authenticating.
* [OLMIS-2637](https://openlmis.atlassian.net/browse/OLMIS-2637): Red password error message will no
longer show when logging in.

5.0.1 / 2017-05-26
==================

Bug fixes

* [OLMIS-2445](https://openlmis.atlassian.net/browse/OLMIS-2445) - Button and title capitalization are consistent.

5.0.0 / 2017-05-08
==================

Compatibility breaking changes:

* [OLMIS-2107](https://openlmis.atlassian.net/browse/OLMIS-2107): Add breadcrumbs to top of page navigation
  * Main state has been added to the whole application and thus interceptors had to be modified to redirect to the correct states

New functionality added in a backwards-compatible manner:

* [OLMIS-2066](https://openlmis.atlassian.net/browse/OLMIS-2066): Profile and logout are confusing
  * Logout button has been moved to the navigation bar.

Bug fixes and performance improvements which are backwards-compatible:

* [OLMIS-2267](https://openlmis.atlassian.net/browse/OLMIS-2267): Email optional for user setup
* [OLMIS-2204](https://openlmis.atlassian.net/browse/OLMIS-2204): The administration menu item should always be the last menu item

Dev and tooling updates made in a backwards-compatible manner:

* [OLMIS-1853](https://openlmis.atlassian.net/browse/OLMIS-1853): Separate push and pull Transifex tasks in build
* [OLMIS-1609](https://openlmis.atlassian.net/browse/OLMIS-1609): UI i18N message strings are not standardized
