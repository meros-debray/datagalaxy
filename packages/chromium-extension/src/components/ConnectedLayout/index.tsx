import React, { ReactNode } from 'react';
import Menu from '../Menu';
// import FabMenu from '../ui/FabMenu';
import styles from './index.css';

const ConnectedLayout = ({ children }: { children?: ReactNode }) => {
    return (
        <div className={styles.Root}>
            <Menu />
            <div className={styles.Content}>{children}</div>
            {/* <FabMenu /> */}
        </div>
    );
};

export default ConnectedLayout;
