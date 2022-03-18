import React, { useEffect, FC, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { EntityType } from 'shared';
import styled from 'styled-components';
import HorizontalSeparator from '../../../components/HorizontalSeparator';
import LoadingScreen from '../../../components/LoadingScreen';
import Accordion from '../../../components/ui/Accordion';
import EntityHeader from '../../../components/ui/EntityHeader';
import Spinner from '../../../components/ui/Spinner';
import { useStoreState, useStoreActions } from '../../../store/hooks';

/* ---------- STYLES ---------- */

const SRoot = styled.div`
    margin-top: 15px;
`;

const SEntityWrapper = styled.span`
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 6px;
    padding-top: 6px;
`;

const SSpinnerWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0px;
`;

const SSubEntityWrapper = styled.span`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    border: none;
    background: none;
    padding: 6px 0 6px 48px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    box-sizing: border-box;
`;

/* ---------- COMPONENT ---------- */

interface ChildrenObjectsProps {
    entity: EntityType;
}

const ChildrenObjects: FC<ChildrenObjectsProps> = ({ entity }) => {
    // /!\ entity and childrenEntity types are not exactly the same
    const history = useHistory();
    const childrenObjects = useStoreState((state) => state.entity.childrenObjects);
    const [children, setChildren] = useState<EntityType[]>();
    const [grandChildren, setGrandChildren] = useState<EntityType[]>();
    const { updateDisplayedEntity } = useStoreActions((actions) => actions.entity);

    const entityPath = useMemo<string>(() => {
        const t = entity.path.split('\\');

        return t[t.length - 1].toString();
    }, [entity]);

    useEffect(() => {
        const c = [];
        const gc = [];
        childrenObjects?.forEach((co) => {
            const pathSplited = co.path.split('\\');

            if (pathSplited[pathSplited.length - 2] === entityPath) {
                c.push(co);
            }
            if (pathSplited[pathSplited.length - 3] === entityPath) {
                gc.push(co);
            }
        });
        setChildren(c);
        setGrandChildren(gc);
    }, [childrenObjects]);

    const handleClick = (childrenEntity) => {
        updateDisplayedEntity(null);
        const URLLocation = childrenEntity.location.replace(new RegExp('/', 'g'), '.'); // Replace "/" by "." in url
        history.push(`/app/entities/${URLLocation}/`);
    };

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <SRoot>
            {children && children.length !== 0 ? (
                children?.map((childrenEntity) => (
                    <>
                        <Accordion
                            key={childrenEntity.id}
                            disabled={childrenEntity.childrenCount === 0}
                            header={
                                <SEntityWrapper onClick={() => handleClick(childrenEntity)}>
                                    <EntityHeader
                                        displayPath={false}
                                        entity={childrenEntity}
                                        id={`entityHeader${childrenEntity.id}`}
                                    />
                                </SEntityWrapper>
                            }
                            openButtonPosition="left"
                        >
                            {grandChildren.length > 0 ? (
                                grandChildren.map((grandChildrenEntity) => (
                                    <>
                                        <HorizontalSeparator />
                                        <SSubEntityWrapper
                                            key={grandChildrenEntity.id}
                                            onClick={() => handleClick(grandChildrenEntity)}
                                        >
                                            <EntityHeader
                                                entity={grandChildrenEntity}
                                                id={`entityHeader${grandChildrenEntity.id}`}
                                            />
                                        </SSubEntityWrapper>
                                    </>
                                ))
                            ) : (
                                <SSpinnerWrapper>
                                    <Spinner />
                                </SSpinnerWrapper>
                            )}
                        </Accordion>
                        <HorizontalSeparator />
                    </>
                ))
            ) : (
                <LoadingScreen />
            )}
        </SRoot>
    );
};

export default ChildrenObjects;
