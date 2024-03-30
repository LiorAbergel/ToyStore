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

        public void AddToy(Toy toy)
        {
            Toys.Add(toy);
            SaveChanges();
        }

        public void UpdateToy(Toy toy)
        {
            Entry(toy).State = EntityState.Modified;
            SaveChanges();
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