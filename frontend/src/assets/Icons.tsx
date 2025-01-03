import { JSX } from "solid-js";
type SvgProps = JSX.SvgSVGAttributes<SVGSVGElement>;

export const UploadRounded = (props: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="width: 24px;height: 24px;"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="0" y="0" width="24" height="24" fill="rgba(255, 255, 255, 0)" />
    <path
      fill="currentColor"
      d="M12 16q-.425 0-.713-.288T11 15V7.85L9.125 9.725q-.3.3-.7.3T7.7 9.7q-.3-.3-.287-.712T7.7 8.3l3.6-3.6q.15-.15.325-.212T12 4.425q.2 0 .375.063t.325.212l3.6 3.6q.3.3.288.713T16.3 9.7q-.3.3-.713.313t-.712-.288L13 7.85V15q0 .425-.288.713T12 16Zm-6 4q-.825 0-1.413-.588T4 18v-2q0-.425.288-.713T5 15q.425 0 .713.288T6 16v2h12v-2q0-.425.288-.713T19 15q.425 0 .713.288T20 16v2q0 .825-.588 1.413T18 20H6Z"
    />
  </svg>
);

export const FirePatch = (props: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="width: 24px;height: 24px;"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
    <path
      fill="currentColor"
      d="M14.48 18.71a3.996 3.996 0 0 1-5.163-5.272l2.619 2.619l2.12-2.121l-2.618-2.619a3.988 3.988 0 0 1 5.2 5.308l1.933 1.933A7.96 7.96 0 0 0 20 14A17.115 17.115 0 0 0 13.5.67a21.494 21.494 0 0 1 .74 4.8a3.47 3.47 0 0 1-3.41 3.73A3.64 3.64 0 0 1 7.2 5.47l.03-.36A13.768 13.768 0 0 0 4 14a8 8 0 0 0 12.43 6.66Z"
    />
  </svg>
);

export const PlusIcon = (props: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="width: 24px;height: 24px;"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
    <path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z" />
  </svg>
);

export const RestoreIcon = (props: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="width: 24px;height: 24px;"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
    <path
      fill="currentColor"
      d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V5q0-.425.288-.713T19 4q.425 0 .713.288T20 5v5q0 .425-.288.713T19 11h-5q-.425 0-.713-.288T13 10q0-.425.288-.713T14 9h3.2q-.8-1.4-2.188-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.725 0 3.188-.913t2.187-2.437q.125-.275.413-.463t.587-.187q.575 0 .863.4t.062.9q-.95 2.125-2.925 3.413T12 20Z"
    />
  </svg>
);

export const DeleteIcon = (props: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="width: 24px;height: 24px;"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
    <path
      fill="currentColor"
      d="M7 21q-.825 0-1.413-.588T5 19V6q-.425 0-.713-.288T4 5q0-.425.288-.713T5 4h4q0-.425.288-.713T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.588 1.413T17 21H7Zm2-5q0 .425.288.713T10 17q.425 0 .713-.288T11 16V9q0-.425-.288-.713T10 8q-.425 0-.713.288T9 9v7Zm4 0q0 .425.288.713T14 17q.425 0 .713-.288T15 16V9q0-.425-.288-.713T14 8q-.425 0-.713.288T13 9v7Z"
    />
  </svg>
);

export const DeployedCodeIcon = (props: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="fill: currentColor"
    height="24"
    viewBox="0 96 960 960"
    width="24"
    {...props}
  >
    <path d="M440 965 160 804q-19-11-29.5-29T120 735V417q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800 804L520 965q-19 11-40 11t-40-11Zm40-69 40-23V599l240-139v-42l-43-25-237 137-237-137-43 25v42l240 139v274l40 23Z" />
  </svg>
);
