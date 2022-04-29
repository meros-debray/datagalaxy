import React, { useRef } from 'react';
import styled from 'styled-components';
import { isEllipsis } from '../../utils';
import Glyph from './Glyph';
import Tooltip from './Tooltip';

/* ---------- STYLES ---------- */

const HiddenCheckbox = styled.input`
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`;

const SGlyph = styled(Glyph)`
    color: #ffffff;
    font-size: 13px;
`;

const StyledCheckbox = styled.div`
    display: inline-block;
    width: 13px;
    height: 13px;
    background: ${(props) => (props.checked ? '#1035B1' : '#ffffff')};
    transition: all 150ms;
    border: 2px solid ${(props) => (props.checked ? '#1035B1' : '#C1C2DA')};
    flex: none;

    ${SGlyph} {
        visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
    }
`;

const CheckboxContainer = styled.label`
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px;

    &:hover,
    &:focus {
        background-color: rgba(0, 26, 255, 0.08);
    }
`;

const SLabel = styled.span`
    margin-left: 13px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
`;

const SIconContainer = styled.span`
    margin-right: 8px;
`;

/* ---------- COMPONENT ---------- */

interface Props {
    field: {
        label: string;
        icon?: React.ReactNode;
        id: string;
        checked?: boolean;
    };
    className?: string;
    onChange?: (params) => void;
}

const Checkbox: React.FC<Props> = ({ field, className, onChange, ...props }) => {
    const checkboxContainerRef = useRef<HTMLLabelElement>(null);

    return (
        <>
            <CheckboxContainer
                ref={checkboxContainerRef}
                className={className}
                data-for={field?.id}
                data-tip={isEllipsis(checkboxContainerRef.current) ? field?.label : undefined}
                htmlFor={field?.id}
            >
                <HiddenCheckbox
                    checked={field?.checked}
                    id={field?.id}
                    onChange={onChange}
                    type="checkbox"
                    {...props}
                />
                <StyledCheckbox checked={field?.checked}>
                    <SGlyph icon="Check" />
                </StyledCheckbox>
                <SLabel>
                    {field?.icon && <SIconContainer>{field?.icon}</SIconContainer>} {field?.label}
                </SLabel>
            </CheckboxContainer>
            <Tooltip effect="float" id={field?.id} />
        </>
    );
};

export default Checkbox;
