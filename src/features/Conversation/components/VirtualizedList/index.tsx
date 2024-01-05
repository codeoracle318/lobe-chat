import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import React, { useEffect, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import SafeSpacing from '@/components/SafeSpacing';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

import Item from '../ChatItem';

const itemContent = (index: number, id: string) =>
  index === 0 ? <SafeSpacing /> : <Item id={id} index={index - 1} />;

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;
      overflow: hidden auto;
      height: 100%;
    `,
  };
});

const VirtualizedList = () => {
  const { styles } = useStyles();

  const data = useChatStore(
    (s) => ['empty', ...chatSelectors.currentChatIDsWithGuideMessage(s)],
    isEqual,
  );

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const id = useChatStore((s) => s.activeId + s.activeTopicId);

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ align: 'start', behavior: 'smooth', index: 'LAST' });
    }
  }, [id]);

  return (
    <Flexbox className={styles.container}>
      <Virtuoso
        data={data}
        followOutput={'auto'}
        initialTopMostItemIndex={data?.length - 1}
        itemContent={itemContent}
        overscan={6}
        ref={virtuosoRef}
      />
    </Flexbox>
  );
};

export default VirtualizedList;
