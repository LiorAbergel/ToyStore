using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.DAL
{
    public class ToyDAL : DbContext
    {
        public ToyDAL() : base("DatabaseConnection") {}

        public DbSet<Toy> Toys { get; set; } // Define DbSet for Toy model

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Configuration.LazyLoadingEnabled = true;
            modelBuilder.Entity<Toy>().ToTable("Toy");
            base.OnModelCreating(modelBuilder);
        }
        public List<Toy> GetToys()
        {
            return Toys.ToList();
        }

        public void Add(Toy toy)
        {
            Toys.Add(toy);
            SaveChanges();
        }

        public void EditToy(Toy toy)
        {
            // Check if the toy exists in the context
            Toy existingToy = Toys.Find(toy.ToyId);
            if (existingToy != null)
            {
                // Update the properties of the existing toy
                Entry(existingToy).CurrentValues.SetValues(toy);
                SaveChanges();
            }
            else
            {
                // Toy not found, handle accordingly (e.g., throw exception or log error)
                // For now, let's log an error
                Console.WriteLine("Error: Toy not found for editing.");
            }
        }


        public void DeleteToy(int id)
        {
            Toy toy = Toys.Find(id);
            Toys.Remove(toy);
            SaveChanges();
        }

        public Toy GetToyById(int id)
        {
            return Toys.Find(id);
        }

        public List<Toy> GetToysByName(string searchValue)
        {
            return Toys.Where(x => x.Name.Contains(searchValue)).ToList();
        }

        public List<Toy> GetToysByCategory(string searchValue)
        {
            return Toys.Where(x => x.Category.Name.Contains(searchValue)).ToList();
        }

        public List<Toy> GetToysByDescription(string searchValue)
        {
            return Toys.Where(x => x.Description.Contains(searchValue)).ToList();
        }

        public List<Toy> SearchToy(string searchValue)
        {
            return GetToysByName(searchValue)
                .Union(GetToysByCategory(searchValue))
                .Union(GetToysByDescription(searchValue)).ToList();
        }
    }
}