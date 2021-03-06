# Zaizi take-home challenge

## How to use:

- View the deployed challenge on GitHub Pages here: https://joe-dev-public.github.io/fac-zaizi-take-home-challenge/
- Read the text, and try changing the number of simulations by adjusting the slider and clicking the button.
- A larger number of simulations should be more convincing! 🙂
- Note that the stats and calculations (inline numbers in bold text) change when new simulations are run.

## Known issues

- Chart labels might be cut off on narrow displays (e.g. mobile).
- Calculating larger numbers of simulations might be a bit slow on some mobile/lower-powered devices!
- It's possible to get some "unhelpful"/extreme results, especially if doing a lower number of simulations.
  - e.g. 0 wins for stick, 10 wins for switch, which gives switch "Infinity" more wins than stick.
  - (Is there a good way of catching these? Does that weaken the "proof"?)

## Next steps?

- Let users vary the number of simulation sets.
  - It's currently fixed at 25 so that things don't get too slow, but a slider could be provided to allow variation from 5-50 for example.
- Improve the simulation? e.g.:
  - better pseudo-random number generation?
  - could the game logic be more "convincing" somehow?
- Improve the explanation text? e.g.:
  - A note about the gradients of the (emergent lines) in the first graph? (i.e. switch is twice as steep as stick?)
  - Following from that, a note about the gap between the stick and switch lines? (i.e. switch is usually "ahead" of stick, not just after x simulations).
- Improve the mathematical rigour and explanation? e.g.:
  - Proper linear regression calculations.
  - Consider standard deviation in second graph.
  - (Of course the current implementation is just supposed to provide "visual reassurance" to a user who is casually sceptical of vos Savant's solution, not a rigorous proof. :)
