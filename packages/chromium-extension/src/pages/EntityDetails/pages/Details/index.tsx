import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { EntityType } from 'shared';
import styled from 'styled-components';
import Accordion from '../../../../components/Accordion';
import Status from '../../../../components/Entity/Status';
import Tags from '../../../../components/Entity/Tags';
import { useStoreState } from '../../../../store/hooks';

/* ---------- STYLES ---------- */

const SAccordionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    width: 100%;
`;

const SRoot = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const SSeparator = styled.div`
    height: 1px;
    background-color: #f3f6ff;
`;

const SSubInfoContent = styled.span`
    font-size: 12px;
    color: #001030;
    margin-bottom: 12px;
    line-height: 1.5;
`;

const SSubInfoTitle = styled.span`
    font-size: 10px;
    font-weight: 600;
    color: #1035b1;
    margin-top: 12px;
    margin-bottom: 4px;
`;

const SSubInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    word-break: break-all;
    width: 100%;
`;

/* ---------- COMPONENT ---------- */

interface DetailsProps {
    entity: EntityType;
    setEntity: Dispatch<SetStateAction<EntityType>>;
}

const Details = ({ entity, setEntity }: DetailsProps) => {
    const fullyLoadedEntity = useStoreState((state) => state.entity.displayedEntity);

    // Initialize the entity with data coming from search to be able to
    // display some information instantly
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (fullyLoadedEntity) {
            setEntity(fullyLoadedEntity);
            setLoaded(true);
        }
    }, [fullyLoadedEntity]);

    return (
        <SRoot>
            {loaded && (
                <SAccordionWrapper>
                    <Accordion title={chrome.i18n.getMessage(`entity_details_sections_general`)} initialOpen>
                        <Details.SubInfo title={chrome.i18n.getMessage(`entity_details_sections_general_status`)}>
                            <Status status={entity.attributes?.status} />
                        </Details.SubInfo>
                        <Details.Separator />
                        <Details.SubInfo title={chrome.i18n.getMessage(`entity_details_sections_general_tags`)}>
                            <Tags>
                                {entity.attributes?.tags?.map((tag) => (
                                    <Tags.Item key={tag} hideLabel={entity.attributes?.tags?.length > 1} tag={tag} />
                                ))}
                            </Tags>
                        </Details.SubInfo>
                        <Details.Separator />
                        <Details.SubInfo title={chrome.i18n.getMessage(`entity_details_sections_general_summary`)}>
                            {entity.attributes?.summary}
                        </Details.SubInfo>
                        <Details.Separator />
                        <Details.SubInfo title={chrome.i18n.getMessage(`entity_details_sections_general_description`)}>
                            {entity.attributes?.description}
                        </Details.SubInfo>
                    </Accordion>
                </SAccordionWrapper>
            )}
        </SRoot>
    );
};

Details.SubInfo = ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
        <SSubInfoWrapper>
            <SSubInfoTitle>{title}</SSubInfoTitle>
            <SSubInfoContent>{children}</SSubInfoContent>
        </SSubInfoWrapper>
    );
};

Details.Separator = () => {
    return <SSeparator />;
};

export default Details;
