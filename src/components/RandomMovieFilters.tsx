import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import Separator from './Separator'
import { Picker } from '@react-native-picker/picker'

import { SetState } from '@/types'
import { colors, genres, spacing, borderRadius, fontSize, fontFamily } from '@/config'

type Props = {
  genreFilter: string;
  mandyFilter: boolean;
  setFiltersModalVisible: SetState<boolean>;
  setGenreFilter: (genre: string) => void;
  setMandyFilter: SetState<boolean>;
  setUnseenFilter: SetState<boolean>;
  setWatchlistFilter: SetState<boolean>;
  unseenFilter: boolean;
  watchlistFilter: boolean;
};

export default function RandomMovieFilters({
  genreFilter,
  mandyFilter,
  setFiltersModalVisible,
  setGenreFilter,
  setMandyFilter,
  setUnseenFilter,
  setWatchlistFilter,
  unseenFilter,
  watchlistFilter,
}: Props) {
  return (
    <View style={styles.filtersModalContainer}>
      <Pressable
        style={styles.transparentBg}
        onPress={() => setFiltersModalVisible(false)}
        accessibilityRole="button"
        accessibilityLabel="Close filters"
      />
      <View style={styles.filtersModal}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Filters</Text>
        </View>
        <View style={{ width: '75%' }}>
          <Text style={styles.label}>Unseen</Text>
        </View>
        <View style={{ width: '25%' }}>
          <Switch
            onValueChange={setUnseenFilter}
            value={unseenFilter}
            trackColor={{ true: colors.orange }}
            thumbColor={colors.light}
            accessibilityLabel="Filter unseen movies"
          />
        </View>
        <Separator modal />
        <View style={{ width: '75%' }}>
          <Text style={styles.label}>On Watchlist</Text>
        </View>
        <View style={{ width: '25%' }}>
          <Switch
            onValueChange={setWatchlistFilter}
            value={watchlistFilter}
            trackColor={{ true: colors.orange }}
            thumbColor={colors.light}
            accessibilityLabel="Filter watchlist movies"
          />
        </View>
        <Separator modal />
        <View style={{ width: '75%' }}>
          <Text style={styles.label}>Masterpieces</Text>
        </View>
        <View style={{ width: '25%' }}>
          <Switch
            onValueChange={setMandyFilter}
            value={mandyFilter}
            trackColor={{ true: colors.orange }}
            thumbColor={colors.light}
            accessibilityLabel="Filter masterpiece movies"
          />
        </View>
        <Separator modal />
        <View style={{ width: '60%' }}>
          <Text style={styles.label}>Genre</Text>
        </View>
        <View style={{ width: '40%' }}>
          <Picker
            selectedValue={genreFilter}
            style={{ height: 50, width: 150 }}
            onValueChange={setGenreFilter}
            accessibilityLabel="Select genre filter"
          >
            {['All', ...genres].map((genre) => (
              <Picker.Item key={genre} style={styles.label} label={genre} value={genre} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: spacing.sm,
  },
  headerText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xxl + 1,
  },
  filtersModalContainer: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  transparentBg: {
    height: '100%',
    backgroundColor: '#0000007b',
  },
  filtersModal: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: borderRadius.circle + 15,
    borderTopRightRadius: borderRadius.circle + 15,
    borderColor: colors.orange,
    borderWidth: 4,
    borderBottomWidth: 0,
    backgroundColor: colors.white,
    height: 'auto',
    padding: spacing.lg,
    paddingTop: borderRadius.circle + 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    color: 'black',
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
  },
});