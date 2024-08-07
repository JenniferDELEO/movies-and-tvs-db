import { FC } from "react";

import TopContent from "@/components/DetailsMedia/TopContent";
import CrewBanner from "@/components/DetailsMedia/Banners/CrewBanner";
import SimilarsBanner from "@/components/DetailsMedia/Banners/SimilarsBanner";
import { TvDetails } from "@/models/tvs";
import SeasonsAndEpisodesWrapper from "@/components/DetailsMedia/Tv/SeasonsAndEpisodesWrapper";

type Props = {
  tvDetails: TvDetails;
  tvUrl: string;
};

const TvWrapper: FC<Props> = (props) => {
  const { tvDetails, tvUrl } = props;

  return (
    <div className="size-full">
      <TopContent tvDetails={tvDetails} type="tv" />
      <CrewBanner
        castTv={tvDetails?.aggregate_credits?.cast}
        mediaUrl={tvUrl}
        type="tv"
      />
      {tvDetails?.seasons?.length > 0 && (
        <SeasonsAndEpisodesWrapper
          seasons={tvDetails.seasons.filter(
            (season) => season.season_number !== 0
          )}
          tvId={tvDetails.id}
        />
      )}
      {tvDetails?.similar?.results?.length > 0 && (
        <SimilarsBanner
          similarsTvs={tvDetails.similar.results}
          totalPages={tvDetails.similar.total_pages}
          totalResults={tvDetails.similar.total_results}
        />
      )}
    </div>
  );
};

export default TvWrapper;
