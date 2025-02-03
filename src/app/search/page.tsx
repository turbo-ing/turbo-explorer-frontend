import Container from "@/components/Container";
import { FilterType } from "@/components/Search";
import SearchPanel from "@/components/SearchPanel";
import { fetchSearch } from "@/util/fetchSearch";

interface SearchParams {
  query?: string;
  filter?: FilterType;
}

export default async function SearchPage({
    params,
}: {
  params: Promise<SearchParams>;
}) {
    const {query, filter} = await params;

  // Perform SSR on the initial request.
  const results = await fetchSearch(query|| "", filter as FilterType);

  return (
    <Container className="p-4 sm:p-8">
      <SearchPanel initialQuery={query || ""} initialFilter={filter as FilterType} initialResults={results} />
    </Container>
  );
}
