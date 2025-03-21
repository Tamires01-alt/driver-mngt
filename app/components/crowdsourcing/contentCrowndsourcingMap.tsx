"use client";
import dynamic from "next/dynamic";
import { SelectionDrawer } from "./confirmSelectionCrowndsourcing";
import { CSSProperties, FC } from "react";


interface MyPageProps {
  serverSession?: boolean | null;
  closed?: boolean;
  clusters: any[];
  center: [number, number];
  defaultClusters?: any[];
  style?: CSSProperties;
  choosed_station?: any;
  crowdSourcing?: any;
  bonds: [number, number][];
  availableShifts?: any[];
  disableSelection: boolean;
}

const Map = dynamic(() => import("./crowndsourcingMap"), {
  loading: () => <div></div>,
  ssr: false,
});

const MyPage: FC<MyPageProps> = ({
  serverSession = null,
  closed,
  clusters,
  center,
  defaultClusters,
  style,
  choosed_station,
  crowdSourcing,
  bonds,
  availableShifts,
  disableSelection,
}) => {
  return (
    <>
      {!disableSelection && (
        <SelectionDrawer
          serverSession={serverSession}
          choosed_station={choosed_station}
          crowdSourcing={crowdSourcing}
          availableShifts={availableShifts}
        />
      )}

      <Map
        zoom={10}
        bonds={bonds}
        serverSession={serverSession}
        disableSelection={disableSelection}
        closed={closed}
        clusters={clusters}
        center={center}
        defaultClusters={defaultClusters}
        style={style}
      />
    </>
  );
};

export default MyPage;
