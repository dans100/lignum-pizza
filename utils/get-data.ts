const getData = async (params: string, id?: string) => {
  const url = id ? `/api/${params}/${id}` : `/api/${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const { data } = await response.json();

  return data;
};

export default getData;
