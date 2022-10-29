// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SheepSVG {
    string SVGStart =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 20 20' shape-rendering='crispEdges'>";
    string SVGPathStart = "<path stroke='";
    string SVGPath =
        "' d='M4 3h3M3 4h5M2 5h15M1 6h2M16 6h3M1 7h1M17 7h1M1 8h1M17 8h1M1 9h1M17 9h1M1 10h1M17 10h1M1 11h2M16 11h2M2 12h15M4 13h1M6 13h1M13 13h1M15 13h1M3 14h2M6 14h1M12 14h2M15 14h1M5 15h2M14 15h2' />";
    string SVGEnd = "</svg>";
    string happyFace =
        "<path stroke='#13141a' d='M4 7h1M6 7h1M3 9h1M7 9h1M3 10h5' />";
    string neutralFace = "<path stroke='#13141a' d='M4 7h1M6 7h1M3 9h5' />";
    string sadFace =
        "<path stroke='#13141a' d='M4 7h1M6 7h1M3 9h5M3 10h1M7 10h1' />";
}
