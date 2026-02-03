import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { borderRadius, spacing } from '@/config';
import Skeleton from './Skeleton';

const ITEMS = Array.from({ length: 6 }, (_, i) => i);
const ASPECT_RATIO = 230 / 150;

export default function MovieGridSkeleton() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.38;
  const cardHeight = cardWidth * ASPECT_RATIO;

  return (
    <View style={styles.container}>
      {ITEMS.map((i) => (
        <View key={i} style={styles.item}>
          <Skeleton width={cardWidth} height={cardHeight} borderRadiusValue={borderRadius.sm} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: spacing.md,
  },
  item: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    width: '50%',
  },
});
