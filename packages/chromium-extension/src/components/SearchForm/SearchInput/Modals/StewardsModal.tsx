import React, { useEffect, useState, FC } from 'react';
import { useStoreState, useStoreDispatch, useStoreActions } from '../../../../store/hooks';
import Avatar from '../../../Avatar';
import ModalBase from '../ModalBase';

/* ---------- COMPONENT ---------- */

const StewardsModal: FC = () => {
    const dispatch = useStoreDispatch();
    const users = useStoreState((state) => state.filters.users);
    const pickedFilters = useStoreState((state) => state.filters.pickedFilters);
    const { updatePickedFilters } = useStoreActions((actions) => actions.filters);
    const [intersectionLogic, setIntersectionLogic] = useState('or');
    const [usersFields, setUsersFields] = useState([]);
    const { DataStewards } = useStoreState((state) => state.modal);

    useEffect(() => {
        const fetchUsersAPI = async () => {
            await dispatch.filters.fetchUsers(null);
        };

        fetchUsersAPI();
    }, [dispatch]);

    useEffect(() => {
        const index = pickedFilters?.findIndex((item) => item?.filter?.attributeKey === 'DataStewards');
        const formatedUsersFields = users?.stewards?.map((item) => {
            return {
                id: item.userId,
                label: `${item.firstName} ${item.lastName}`,
                icon: <Avatar size="mini" user={item} />,
                checked: !!pickedFilters?.[index]?.filter?.values?.includes(item.userId),
            };
        });
        setUsersFields(formatedUsersFields);
    }, [users, pickedFilters]);

    const handleChange = (id) => {
        const newPickedFilters = [...pickedFilters];
        const filterIndex = newPickedFilters?.findIndex((item) => item?.filter?.attributeKey === 'DataStewards');
        const newOperator = intersectionLogic === 'or' ? 'contains' : 'matchAll';
        if (filterIndex === -1) {
            const filter = {
                icon: usersFields.find((item) => item.id === id).icon,
                filter: { attributeKey: 'DataStewards', operator: newOperator, values: [id] },
            };
            newPickedFilters.push(filter);
        } else {
            const { values } = newPickedFilters[filterIndex].filter;
            newPickedFilters[filterIndex].filter.operator = newOperator;
            const idIndex = values?.findIndex((item) => item === id);

            if (idIndex === -1) {
                values.push(id);
            } else {
                values.splice(idIndex, 1);
            }

            if (values.length === 0) {
                newPickedFilters.splice(filterIndex, 1);
            } else if (values.length > 1) {
                newPickedFilters[filterIndex].icon = null;
            }
        }

        updatePickedFilters(newPickedFilters);
    };

    const handleChangeIntersectionLogic = (params) => {
        setIntersectionLogic(params);
        const newPickedFilters = [...pickedFilters];
        const filterIndex = newPickedFilters?.findIndex((item) => item?.filter?.attributeKey === 'DataStewards');
        const newOperator = params === 'or' ? 'contains' : 'matchAll';
        if (filterIndex !== -1) {
            newPickedFilters[filterIndex].filter.operator = newOperator;
        }

        updatePickedFilters(newPickedFilters);
    };

    return (
        <ModalBase
            fields={usersFields}
            handleChangeIntersectionLogic={handleChangeIntersectionLogic}
            intersectionLogic={intersectionLogic}
            isOpen={DataStewards}
            label={chrome.i18n.getMessage(`attribute_key_DataStewards`)}
            onChange={handleChange}
            multiselect
        />
    );
};

export default StewardsModal;
