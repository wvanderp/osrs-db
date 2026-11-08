import com.google.gson.Gson;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import net.runelite.cache.definitions.LocationsDefinition;
import net.runelite.cache.fs.Store;
import net.runelite.cache.region.Location;
import net.runelite.cache.region.Position;
import net.runelite.cache.region.RegionLoader;
import net.runelite.cache.util.XteaKeyManager;

/** Exports authoritative world coordinates for every object placed in the cache. */
public final class ObjectLocationsExporter
{
	private static final int MAX_REGION = 25287;

	private static final class Placement
	{
		private final int sourceObjectId;
		private final int x;
		private final int y;
		private final int plane;

		private Placement(int sourceObjectId, int x, int y, int plane)
		{
			this.sourceObjectId = sourceObjectId;
			this.x = x;
			this.y = y;
			this.plane = plane;
		}
	}

	private ObjectLocationsExporter()
	{
	}

	public static void main(String[] args) throws IOException
	{
		if (args.length != 3)
		{
			throw new IllegalArgumentException("Usage: ObjectLocationsExporter <cache> <keys.json> <output.json>");
		}

		XteaKeyManager keyManager = new XteaKeyManager();
		try (FileInputStream input = new FileInputStream(args[1]))
		{
			keyManager.loadKeys(input);
		}

		List<Placement> placements = new ArrayList<>();
		try (Store store = new Store(new File(args[0])))
		{
			store.load();
			RegionLoader loader = new RegionLoader(store, keyManager);

			for (int regionId = 0; regionId < MAX_REGION; regionId++)
			{
				LocationsDefinition definition;
				try
				{
					definition = loader.loadLocDef(regionId);
				}
				catch (IOException exception)
				{
					continue;
				}

				if (definition == null)
				{
					continue;
				}

				int baseX = definition.getRegionX() * 64;
				int baseY = definition.getRegionY() * 64;
				for (Location location : definition.getLocations())
				{
					Position position = location.getPosition();
					placements.add(new Placement(
						location.getId(),
						baseX + position.getX(),
						baseY + position.getY(),
						position.getZ()
					));
				}
			}
		}

		try (FileWriter writer = new FileWriter(args[2]))
		{
			new Gson().toJson(placements, writer);
		}
	}
}
