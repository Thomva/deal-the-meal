import { default as React, useState } from 'react';
import * as Routes from '../../routes';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useApi } from '../../services';
import { CustomSelect } from '../inputs';
import Utils from '../../utilities/Utils';
import { useCallback } from 'react';

const SearchFilter = ({ onFilterChange, defaultValues }) => {
  const {findAllCategories} = useApi();
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [sorts, setSorts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(defaultValues.category);
  const [selectedSortId, setSelectedSortId] = useState();
  const [url, setUrl] = useState(null);

  
  const getSorts = useCallback(
    () => {
      const sortTypes = [
        'date',
        'id',
        'title',
      ]

      const s = [];
      sortTypes.forEach((sortType, i) => {
        s.push(
          { id: `${i}A`, sortType, order: '-1', name: `${sortType} ↘` },
          { id: `${i}B`, sortType, order: '1', name: `${sortType} ↗` },
        );
      });
      s[0].isSelected = true;
      setSorts(s);
    },
    []
  );

  const fetchCategories = useCallback(
    () => {
      const fetchCs = async () => {
        let fetchedCategories = [];
        fetchedCategories = await findAllCategories();
        const newCategories = fetchedCategories.map((category) => {
          return ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            isSelected: (defaultValues && defaultValues.category && category.id === defaultValues.category),
          })
        });
        newCategories.unshift({
          id: '-1',
          name: 'All',
          slug: '',
          isSelected: (!defaultValues || !defaultValues.category) ? true : false,
        })
        setSelectedCategory(newCategories.find((option) => option.isSelected === true).id);
      setCategories(newCategories);
      }

      fetchCs();
    },
    [findAllCategories, defaultValues]
  );


  useEffect(() => {
    getSorts();
    fetchCategories();
  }, [fetchCategories, getSorts]);

  useEffect(() => {
    const selectedSort = sorts.find((sort) => sort.id === selectedSortId);
      const params = [
        { key: 'c', value: selectedCategory, deleteIf: ['-1', ''] },
        { key: 'order', value: (selectedSort ? selectedSort.order : '') },
        { key: 'sortType', value: (selectedSort ? selectedSort.sortType : '') }
      ]
      setUrl(`${Routes.RESULTS}?${Utils.getUpdatedParametersFromUrl(params)}`);
  }, [selectedCategory, selectedSortId, sorts]);

  useEffect(() => {
    if (url) history.push(`${url}`);
  }, [url, history]);

  const categoryChangeHandler = (e) => {
    setSelectedCategory(e.id);
  }

  const sortChangeHandler = (e) => {
    setSelectedSortId(e.id);
  }

	return (
    <>
    <div className="searchFilter">
      <CustomSelect choices={categories} label="Category" name="categorySelect" onChange={categoryChangeHandler} selectedValue={selectedCategory} />
      <CustomSelect choices={sorts} label="SortBy" name="sortSelect" onChange={sortChangeHandler} />
    </div>
    </>
	);
};

export default SearchFilter;
